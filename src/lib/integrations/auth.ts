import "server-only";

import { cookies } from "next/headers";
import type { Customer, Address } from "@/lib/types";
import { kvRead, kvWrite, nsKey } from "@/lib/store/kv";

// ---------------------------------------------------------------------------
// AuthProvider interface
//
// Covers the full customer-account surface we need in Phase 3: signup,
// signin, signout, password reset request/redeem, current session/customer
// lookup, profile updates, and saved-address CRUD.
//
// Only the mock implementation is provided in this session — real adapters
// (bcrypt + postgres + session store of choice) wire in at engine time and
// must satisfy this interface.
// ---------------------------------------------------------------------------

export interface Session {
  userId: string;
  email: string;
  expiresAt: string; // ISO
}

export interface AuthProvider {
  readonly name: string;

  // -- session lookup
  getCurrentSession(): Promise<Session | null>;
  getCurrentCustomer(): Promise<Customer | null>;

  // -- signup / signin / signout
  signUp(
    email: string,
    password: string,
    name: string
  ): Promise<Customer>;
  signIn(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;

  // -- password reset
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;

  // -- profile / addresses (so /account/settings can stay provider-agnostic)
  updateCustomer(
    id: string,
    patch: Partial<Pick<Customer, "name" | "email">>
  ): Promise<Customer>;
  updatePassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
  deleteCustomer(id: string, password: string): Promise<void>;
  setAddresses(id: string, addresses: Address[]): Promise<Customer>;
}

// ---------------------------------------------------------------------------
// Mock implementation
//
// - Customers persisted in KV at `${ns}:customers:all`
// - Password hashing uses Web Crypto sha-256 + random salt. This is NOT
//   acceptable for production. Real adapters will swap in bcrypt/argon2.
// - Sessions are stateless HMAC-signed tokens stored in an HttpOnly cookie
//   using Web Crypto (no external library). The token encodes `userId` and
//   `exp` in the payload and the server rejects expired or tampered tokens.
// ---------------------------------------------------------------------------

type StoredCustomer = Customer & {
  passwordHash: string;
  passwordSalt: string;
  resetToken?: string;
  resetTokenExpiresAt?: string;
};

const CUSTOMERS_KEY = nsKey("customers", "all");
const SESSION_COOKIE = "oliveto_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// --- crypto helpers --------------------------------------------------------

const enc = new TextEncoder();
const dec = new TextDecoder();

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

function b64url(input: string | Uint8Array): string {
  const bytes =
    typeof input === "string" ? enc.encode(input) : input;
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(input: string): string {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  while (input.length % 4) input += "=";
  const bin = atob(input);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return dec.decode(bytes);
}

// TODO(prod): replace sha-256 with bcrypt/argon2 via a real adapter.
async function hashPassword(password: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    enc.encode(`${salt}:${password}`)
  );
  return toHex(digest);
}

function randomSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

function sessionSecret(): string {
  return (
    process.env.SESSION_SECRET ??
    process.env.KV_NAMESPACE ??
    "oliveto-dev-secret-not-for-production"
  );
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return b64url(new Uint8Array(sig));
}

async function signToken(payload: Record<string, unknown>): Promise<string> {
  const body = b64url(JSON.stringify(payload));
  const sig = await hmac(body);
  return `${body}.${sig}`;
}

async function verifyToken<T>(token: string): Promise<T | null> {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await hmac(body);
  if (expected !== sig) return null;
  try {
    return JSON.parse(b64urlDecode(body)) as T;
  } catch {
    return null;
  }
}

// --- customer store helpers ------------------------------------------------

async function readCustomers(): Promise<StoredCustomer[]> {
  return (await kvRead<StoredCustomer[]>(CUSTOMERS_KEY)) ?? [];
}

async function writeCustomers(list: StoredCustomer[]): Promise<void> {
  await kvWrite(CUSTOMERS_KEY, list);
}

function publicCustomer(c: StoredCustomer): Customer {
  return {
    id: c.id,
    email: c.email,
    name: c.name,
    addresses: c.addresses ?? [],
  };
}

function randomId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

// --- session cookie helpers ------------------------------------------------

type SessionPayload = { userId: string; email: string; exp: number };

async function setSessionCookie(userId: string, email: string) {
  const exp = Date.now() + SESSION_TTL_MS;
  const token = await signToken({ userId, email, exp } as SessionPayload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(exp),
  });
}

async function readSessionCookie(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken<SessionPayload>(token);
  if (!payload) return null;
  if (payload.exp < Date.now()) return null;
  return payload;
}

export async function getSessionFromCookie(): Promise<Session | null> {
  const payload = await readSessionCookie();
  if (!payload) return null;
  return {
    userId: payload.userId,
    email: payload.email,
    expiresAt: new Date(payload.exp).toISOString(),
  };
}

// ---------------------------------------------------------------------------

export class MockAuthProvider implements AuthProvider {
  readonly name = "mock";

  async getCurrentSession(): Promise<Session | null> {
    return getSessionFromCookie();
  }

  async getCurrentCustomer(): Promise<Customer | null> {
    const session = await getSessionFromCookie();
    if (!session) return null;
    const customers = await readCustomers();
    const found = customers.find((c) => c.id === session.userId);
    return found ? publicCustomer(found) : null;
  }

  async signUp(email: string, password: string, name: string): Promise<Customer> {
    const list = await readCustomers();
    const lower = email.trim().toLowerCase();
    if (list.some((c) => c.email.toLowerCase() === lower)) {
      throw new Error("An account with that email already exists");
    }
    const salt = randomSalt();
    const customer: StoredCustomer = {
      id: randomId("cust"),
      email: lower,
      name: name.trim(),
      addresses: [],
      passwordSalt: salt,
      passwordHash: await hashPassword(password, salt),
    };
    list.push(customer);
    await writeCustomers(list);
    await setSessionCookie(customer.id, customer.email);
    return publicCustomer(customer);
  }

  async signIn(email: string, password: string): Promise<Session> {
    const list = await readCustomers();
    const lower = email.trim().toLowerCase();
    const customer = list.find((c) => c.email.toLowerCase() === lower);
    if (!customer) {
      throw new Error("Invalid email or password");
    }
    const candidate = await hashPassword(password, customer.passwordSalt);
    if (candidate !== customer.passwordHash) {
      throw new Error("Invalid email or password");
    }
    await setSessionCookie(customer.id, customer.email);
    const exp = Date.now() + SESSION_TTL_MS;
    return {
      userId: customer.id,
      email: customer.email,
      expiresAt: new Date(exp).toISOString(),
    };
  }

  async signOut(): Promise<void> {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const list = await readCustomers();
    const lower = email.trim().toLowerCase();
    const customer = list.find((c) => c.email.toLowerCase() === lower);
    // Always succeed silently to avoid email enumeration. Only send a real
    // email if the account exists.
    if (!customer) return;
    const token = randomId("rst").slice(4);
    customer.resetToken = token;
    customer.resetTokenExpiresAt = new Date(
      Date.now() + 60 * 60 * 1000
    ).toISOString();
    await writeCustomers(list);

    // Emit an email through the EmailProvider to keep this provider
    // self-contained.
    const { MockEmailProvider } = await import("./email");
    const mailer = new MockEmailProvider();
    await mailer.send({
      to: customer.email,
      from: "accounts@oliveto.com",
      subject: "Reset your Oliveto password",
      html: `<p>Use the link below to reset your password:</p><p><a href="/account/reset-password?token=${token}">Reset password</a></p>`,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const list = await readCustomers();
    const customer = list.find((c) => c.resetToken === token);
    if (!customer) throw new Error("Invalid or expired reset token");
    if (
      !customer.resetTokenExpiresAt ||
      new Date(customer.resetTokenExpiresAt).getTime() < Date.now()
    ) {
      throw new Error("Invalid or expired reset token");
    }
    customer.passwordSalt = randomSalt();
    customer.passwordHash = await hashPassword(newPassword, customer.passwordSalt);
    customer.resetToken = undefined;
    customer.resetTokenExpiresAt = undefined;
    await writeCustomers(list);
  }

  async updateCustomer(
    id: string,
    patch: Partial<Pick<Customer, "name" | "email">>
  ): Promise<Customer> {
    const list = await readCustomers();
    const found = list.find((c) => c.id === id);
    if (!found) throw new Error("Customer not found");
    if (patch.email) {
      const lower = patch.email.trim().toLowerCase();
      if (
        list.some(
          (c) => c.id !== id && c.email.toLowerCase() === lower
        )
      ) {
        throw new Error("Email already in use");
      }
      found.email = lower;
    }
    if (patch.name) found.name = patch.name.trim();
    await writeCustomers(list);
    return publicCustomer(found);
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const list = await readCustomers();
    const found = list.find((c) => c.id === id);
    if (!found) throw new Error("Customer not found");
    const candidate = await hashPassword(currentPassword, found.passwordSalt);
    if (candidate !== found.passwordHash) {
      throw new Error("Current password is incorrect");
    }
    found.passwordSalt = randomSalt();
    found.passwordHash = await hashPassword(newPassword, found.passwordSalt);
    await writeCustomers(list);
  }

  async deleteCustomer(id: string, password: string): Promise<void> {
    const list = await readCustomers();
    const found = list.find((c) => c.id === id);
    if (!found) throw new Error("Customer not found");
    const candidate = await hashPassword(password, found.passwordSalt);
    if (candidate !== found.passwordHash) {
      throw new Error("Password is incorrect");
    }
    const filtered = list.filter((c) => c.id !== id);
    await writeCustomers(filtered);
    const store = await cookies();
    store.delete(SESSION_COOKIE);
  }

  async setAddresses(id: string, addresses: Address[]): Promise<Customer> {
    const list = await readCustomers();
    const found = list.find((c) => c.id === id);
    if (!found) throw new Error("Customer not found");
    found.addresses = addresses;
    await writeCustomers(list);
    return publicCustomer(found);
  }
}
