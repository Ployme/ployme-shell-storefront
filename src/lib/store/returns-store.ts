import "server-only";

import { kvRead, kvWrite, nsKey } from "@/lib/store/kv";

// ---------------------------------------------------------------------------
// Returns store — KV-backed persistence for return requests.
// ---------------------------------------------------------------------------

export type ReturnStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "received"
  | "refunded";

export type ReturnItem = {
  productId: string;
  variantId: string;
  quantity: number;
  reason: string;
};

export type ReturnRequest = {
  id: string;
  orderId: string;
  customerId?: string;
  customerEmail: string;
  items: ReturnItem[];
  status: ReturnStatus;
  requestedAt: string;
  resolvedAt?: string;
  refundAmount?: number;
  adminNotes?: string;
  customerMessage?: string;
};

const RETURNS_KEY = nsKey("returns", "all");

async function readAll(): Promise<ReturnRequest[]> {
  return (await kvRead<ReturnRequest[]>(RETURNS_KEY)) ?? [];
}

async function writeAll(rows: ReturnRequest[]): Promise<void> {
  await kvWrite(RETURNS_KEY, rows);
}

export async function getAllReturns(): Promise<ReturnRequest[]> {
  return readAll();
}

export async function getReturnsForOrder(orderId: string): Promise<ReturnRequest[]> {
  const all = await readAll();
  return all.filter((r) => r.orderId === orderId);
}

export async function getReturnById(id: string): Promise<ReturnRequest | undefined> {
  const all = await readAll();
  return all.find((r) => r.id === id);
}

export async function createReturn(req: ReturnRequest): Promise<ReturnRequest> {
  const all = await readAll();
  all.push(req);
  await writeAll(all);
  return req;
}

export async function updateReturn(
  id: string,
  patch: Partial<ReturnRequest>
): Promise<ReturnRequest | undefined> {
  const all = await readAll();
  const i = all.findIndex((r) => r.id === id);
  if (i === -1) return undefined;
  all[i] = { ...all[i], ...patch };
  await writeAll(all);
  return all[i];
}

export function nextReturnId(existing: ReturnRequest[]): string {
  // RET-0001 format, simple monotonic counter.
  const max = existing
    .map((r) => Number(r.id.replace(/[^0-9]/g, "")) || 0)
    .reduce((a, b) => Math.max(a, b), 0);
  return `RET-${String(max + 1).padStart(4, "0")}`;
}
