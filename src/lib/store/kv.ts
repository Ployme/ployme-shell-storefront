import "server-only";

// ---------------------------------------------------------------------------
// Shared KV client + generic namespaced read/write helpers.
//
// Mirrors the pattern established in product-store.ts / order-store.ts, but
// centralised so the many Phase 3 providers (discounts, reviews, stock
// alerts, returns, abandoned carts, customers, sessions, …) don't each
// re-implement KV bootstrapping.
// ---------------------------------------------------------------------------

let kvClient: import("@upstash/redis").Redis | null = null;
let kvChecked = false;

export function getKV() {
  if (kvChecked) return kvClient;
  kvChecked = true;

  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (redisUrl && redisToken) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Redis } = require("@upstash/redis") as typeof import("@upstash/redis");
    kvClient = new Redis({ url: redisUrl, token: redisToken });
  }

  return kvClient;
}

export const KV_NAMESPACE = process.env.KV_NAMESPACE ?? "oliveto";

export function nsKey(...parts: string[]): string {
  return [KV_NAMESPACE, ...parts].join(":");
}

// In-memory fallback tables, one per key, so each caller gets its own slot.
const memoryFallback = new Map<string, unknown>();

export async function kvReadList<T>(key: string, seed: T[]): Promise<T[]> {
  const kv = getKV();
  if (!kv) {
    if (!memoryFallback.has(key)) memoryFallback.set(key, [...seed]);
    return memoryFallback.get(key) as T[];
  }
  const data = await kv.get<T[]>(key);
  if (data) return data;
  if (seed.length > 0) await kv.set(key, seed);
  return [...seed];
}

export async function kvWriteList<T>(key: string, rows: T[]): Promise<void> {
  const kv = getKV();
  if (!kv) {
    memoryFallback.set(key, rows);
    return;
  }
  await kv.set(key, rows);
}

export async function kvRead<T>(key: string): Promise<T | null> {
  const kv = getKV();
  if (!kv) {
    return (memoryFallback.get(key) as T | undefined) ?? null;
  }
  return (await kv.get<T>(key)) ?? null;
}

export async function kvWrite<T>(key: string, value: T): Promise<void> {
  const kv = getKV();
  if (!kv) {
    memoryFallback.set(key, value);
    return;
  }
  await kv.set(key, value);
}

export async function kvDelete(key: string): Promise<void> {
  const kv = getKV();
  if (!kv) {
    memoryFallback.delete(key);
    return;
  }
  await kv.del(key);
}
