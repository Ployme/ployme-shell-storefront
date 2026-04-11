import "server-only";

import { kvRead, kvWrite, nsKey } from "@/lib/store/kv";

// ---------------------------------------------------------------------------
// Stock-alerts store: "email me when back in stock" subscriptions.
// ---------------------------------------------------------------------------

export type StockAlert = {
  id: string;
  productId: string;
  variantId?: string;
  email: string;
  createdAt: string;
  notified: boolean;
  notifiedAt?: string;
};

const KEY = nsKey("stock-alerts", "all");

async function readAll(): Promise<StockAlert[]> {
  return (await kvRead<StockAlert[]>(KEY)) ?? [];
}

async function writeAll(rows: StockAlert[]): Promise<void> {
  await kvWrite(KEY, rows);
}

export async function getAllStockAlerts(): Promise<StockAlert[]> {
  return readAll();
}

export async function createStockAlert(
  alert: Omit<StockAlert, "id" | "createdAt" | "notified">
): Promise<StockAlert> {
  const all = await readAll();
  const id = `sa_${Math.random().toString(36).slice(2, 12)}`;
  const record: StockAlert = {
    id,
    createdAt: new Date().toISOString(),
    notified: false,
    ...alert,
  };
  all.push(record);
  await writeAll(all);
  return record;
}

export async function getPendingAlertsForProduct(
  productId: string,
  variantId?: string
): Promise<StockAlert[]> {
  const all = await readAll();
  return all.filter(
    (a) =>
      !a.notified &&
      a.productId === productId &&
      (variantId === undefined ||
        a.variantId === undefined ||
        a.variantId === variantId)
  );
}

export async function markAlertsNotified(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const all = await readAll();
  const now = new Date().toISOString();
  for (const alert of all) {
    if (ids.includes(alert.id)) {
      alert.notified = true;
      alert.notifiedAt = now;
    }
  }
  await writeAll(all);
}
