import "server-only";

import { kvRead, kvWrite, nsKey } from "@/lib/store/kv";

// ---------------------------------------------------------------------------
// Discounts integration.
//
// Stored in KV like other providers. All discount lookups/mutations flow
// through this provider so a real coupon-service adapter can slot in later
// without touching the cart, checkout, or admin UI.
// ---------------------------------------------------------------------------

export type Discount = {
  id: string;
  code: string; // uppercase
  type: "percentage" | "fixed";
  value: number; // percent (10 = 10%) or pence (1000 = £10)
  minimumSpend?: number; // pence
  expiresAt?: string; // ISO
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  usageCount: number;
  active: boolean;
};

export type ValidatedDiscount = {
  discount: Discount;
  amount: number; // pence to subtract
};

export type DiscountValidationError =
  | "not_found"
  | "inactive"
  | "expired"
  | "below_minimum"
  | "usage_limit_reached"
  | "customer_limit_reached";

export interface DiscountsProvider {
  readonly name: string;

  list(): Promise<Discount[]>;
  getById(id: string): Promise<Discount | undefined>;
  getByCode(code: string): Promise<Discount | undefined>;
  create(discount: Discount): Promise<Discount>;
  update(id: string, patch: Partial<Discount>): Promise<Discount | undefined>;
  delete(id: string): Promise<boolean>;

  validate(input: {
    code: string;
    subtotal: number;
    customerEmail?: string;
  }): Promise<
    | { ok: true; result: ValidatedDiscount }
    | { ok: false; error: DiscountValidationError; message: string }
  >;
  recordUsage(id: string, customerEmail?: string): Promise<void>;
}

// --- seed data used on first access ---------------------------------------

function nextMonthIso(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

const SEED: Discount[] = [
  {
    id: "dsc_welcome10",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    usageCount: 0,
    active: true,
  },
  {
    id: "dsc_shipping",
    code: "SHIPPING",
    type: "fixed",
    value: 500,
    minimumSpend: 3000,
    usageCount: 0,
    active: true,
  },
  {
    id: "dsc_summer",
    code: "SUMMER",
    type: "percentage",
    value: 15,
    expiresAt: nextMonthIso(),
    usageCount: 0,
    active: true,
  },
];

// --- KV helpers ------------------------------------------------------------

const DISCOUNTS_KEY = nsKey("discounts", "all");
const USAGE_KEY = (id: string, email: string) =>
  nsKey("discounts", "usage", id, email.toLowerCase());

async function readAll(): Promise<Discount[]> {
  const existing = await kvRead<Discount[]>(DISCOUNTS_KEY);
  if (existing) return existing;
  await kvWrite(DISCOUNTS_KEY, SEED);
  // Log to make it obvious when seeding kicks in during dev.
  console.log("[DiscountsProvider] seeded 3 default discounts");
  return [...SEED];
}

async function writeAll(rows: Discount[]): Promise<void> {
  await kvWrite(DISCOUNTS_KEY, rows);
}

// ---------------------------------------------------------------------------

export class MockDiscountsProvider implements DiscountsProvider {
  readonly name = "mock";

  async list(): Promise<Discount[]> {
    return readAll();
  }

  async getById(id: string): Promise<Discount | undefined> {
    const all = await readAll();
    return all.find((d) => d.id === id);
  }

  async getByCode(code: string): Promise<Discount | undefined> {
    const all = await readAll();
    const upper = code.trim().toUpperCase();
    return all.find((d) => d.code === upper);
  }

  async create(discount: Discount): Promise<Discount> {
    const all = await readAll();
    const withUpper = { ...discount, code: discount.code.toUpperCase() };
    all.push(withUpper);
    await writeAll(all);
    return withUpper;
  }

  async update(
    id: string,
    patch: Partial<Discount>
  ): Promise<Discount | undefined> {
    const all = await readAll();
    const i = all.findIndex((d) => d.id === id);
    if (i === -1) return undefined;
    all[i] = { ...all[i], ...patch };
    if (patch.code) all[i].code = patch.code.toUpperCase();
    await writeAll(all);
    return all[i];
  }

  async delete(id: string): Promise<boolean> {
    const all = await readAll();
    const i = all.findIndex((d) => d.id === id);
    if (i === -1) return false;
    all.splice(i, 1);
    await writeAll(all);
    return true;
  }

  async validate(input: {
    code: string;
    subtotal: number;
    customerEmail?: string;
  }) {
    const discount = await this.getByCode(input.code);
    if (!discount) {
      return {
        ok: false as const,
        error: "not_found" as const,
        message: "That discount code isn't valid",
      };
    }
    if (!discount.active) {
      return {
        ok: false as const,
        error: "inactive" as const,
        message: "That discount code isn't active",
      };
    }
    if (
      discount.expiresAt &&
      new Date(discount.expiresAt).getTime() < Date.now()
    ) {
      return {
        ok: false as const,
        error: "expired" as const,
        message: "That discount code has expired",
      };
    }
    if (
      discount.minimumSpend &&
      input.subtotal < discount.minimumSpend
    ) {
      return {
        ok: false as const,
        error: "below_minimum" as const,
        message: `Spend at least £${(discount.minimumSpend / 100).toFixed(2)} to use this code`,
      };
    }
    if (
      discount.usageLimit !== undefined &&
      discount.usageCount >= discount.usageLimit
    ) {
      return {
        ok: false as const,
        error: "usage_limit_reached" as const,
        message: "That discount code is no longer available",
      };
    }
    if (
      discount.usageLimitPerCustomer !== undefined &&
      input.customerEmail
    ) {
      const used =
        (await kvRead<number>(USAGE_KEY(discount.id, input.customerEmail))) ?? 0;
      if (used >= discount.usageLimitPerCustomer) {
        return {
          ok: false as const,
          error: "customer_limit_reached" as const,
          message: "You've already used this discount code",
        };
      }
    }

    const amount =
      discount.type === "percentage"
        ? Math.round(input.subtotal * (discount.value / 100))
        : Math.min(discount.value, input.subtotal);
    return { ok: true as const, result: { discount, amount } };
  }

  async recordUsage(id: string, customerEmail?: string): Promise<void> {
    const all = await readAll();
    const i = all.findIndex((d) => d.id === id);
    if (i === -1) return;
    all[i].usageCount += 1;
    await writeAll(all);
    if (customerEmail) {
      const key = USAGE_KEY(id, customerEmail);
      const current = (await kvRead<number>(key)) ?? 0;
      await kvWrite(key, current + 1);
    }
  }
}
