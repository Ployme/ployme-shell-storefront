import "server-only";

import { kvRead, kvWrite, nsKey } from "@/lib/store/kv";
import type { CartItem } from "@/lib/types";

// ---------------------------------------------------------------------------
// Abandoned cart store. Captures checkout drop-offs so the
// abandonment-reminder action can email the customer.
// ---------------------------------------------------------------------------

export type CartAbandonment = {
  id: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  abandonedAt: string;
  reminderSentAt?: string;
  recovered: boolean;
  recoveredAt?: string;
};

const KEY = nsKey("abandoned-carts", "all");

async function readAll(): Promise<CartAbandonment[]> {
  return (await kvRead<CartAbandonment[]>(KEY)) ?? [];
}

async function writeAll(rows: CartAbandonment[]): Promise<void> {
  await kvWrite(KEY, rows);
}

export async function getAllAbandonments(): Promise<CartAbandonment[]> {
  return readAll();
}

export async function getAbandonmentById(
  id: string
): Promise<CartAbandonment | undefined> {
  const all = await readAll();
  return all.find((a) => a.id === id);
}

export async function upsertAbandonment(
  input: Omit<CartAbandonment, "id" | "abandonedAt" | "recovered">
): Promise<CartAbandonment> {
  const all = await readAll();
  const lower = input.customerEmail.toLowerCase();
  const existing = all.find(
    (a) => a.customerEmail.toLowerCase() === lower && !a.recovered
  );
  if (existing) {
    existing.items = input.items;
    existing.subtotal = input.subtotal;
    await writeAll(all);
    return existing;
  }
  const record: CartAbandonment = {
    id: `ab_${Math.random().toString(36).slice(2, 12)}`,
    customerEmail: lower,
    items: input.items,
    subtotal: input.subtotal,
    abandonedAt: new Date().toISOString(),
    recovered: false,
  };
  all.push(record);
  await writeAll(all);
  return record;
}

export async function updateAbandonment(
  id: string,
  patch: Partial<CartAbandonment>
): Promise<CartAbandonment | undefined> {
  const all = await readAll();
  const i = all.findIndex((a) => a.id === id);
  if (i === -1) return undefined;
  all[i] = { ...all[i], ...patch };
  await writeAll(all);
  return all[i];
}

export async function markAbandonmentRecoveredByEmail(
  email: string
): Promise<void> {
  const all = await readAll();
  const lower = email.toLowerCase();
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let changed = false;
  for (const row of all) {
    if (
      !row.recovered &&
      row.customerEmail.toLowerCase() === lower &&
      new Date(row.abandonedAt).getTime() >= cutoff
    ) {
      row.recovered = true;
      row.recoveredAt = new Date().toISOString();
      changed = true;
    }
  }
  if (changed) await writeAll(all);
}
