import "server-only";

import type { Order, OrderStatus } from "@/lib/types";
import { SAMPLE_ORDERS } from "@/lib/data/sample-orders";

// ---------------------------------------------------------------------------
// KV-backed order store with in-memory fallback
// ---------------------------------------------------------------------------

let kvClient: import("@upstash/redis").Redis | null = null;
let kvChecked = false;
let fallbackOrders: Order[] | null = null;

function getKV() {
  if (kvChecked) return kvClient;
  kvChecked = true;

  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL;
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN;

  if (redisUrl && redisToken) {
    console.log('[store] using KV naming:',
      process.env.UPSTASH_REDIS_REST_URL ? 'upstash' : 'kv');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Redis } = require("@upstash/redis") as typeof import("@upstash/redis");
    kvClient = new Redis({ url: redisUrl, token: redisToken });
  } else {
    console.warn(
      "WARN: KV not configured, using in-memory store. Data will not persist across serverless instances."
    );
  }

  return kvClient;
}

const NAMESPACE = process.env.KV_NAMESPACE ?? 'oliveto';
const ordersKey = `${NAMESPACE}:orders:all`;
console.log('[store] active namespace:', NAMESPACE);

// -- helpers ----------------------------------------------------------------

async function readAll(): Promise<Order[]> {
  const kv = getKV();

  if (!kv) {
    if (!fallbackOrders) fallbackOrders = [...SAMPLE_ORDERS];
    return fallbackOrders;
  }

  const data = await kv.get<Order[]>(ordersKey);
  if (data) return data;

  // Seed from sample data on first access
  await kv.set(ordersKey, SAMPLE_ORDERS);
  return [...SAMPLE_ORDERS];
}

async function writeAll(orders: Order[]): Promise<void> {
  const kv = getKV();

  if (!kv) {
    fallbackOrders = orders;
    return;
  }

  await kv.set(ordersKey, orders);
}

// -- public API (unchanged) -------------------------------------------------

export async function getAllOrders(): Promise<Order[]> {
  return readAll();
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await readAll();
  return orders.find((o) => o.id === id);
}

export async function createOrder(order: Order): Promise<Order> {
  const orders = await readAll();
  orders.push(order);
  await writeAll(orders);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | undefined> {
  const orders = await readAll();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return undefined;
  orders[index] = { ...orders[index], status };
  await writeAll(orders);
  return orders[index];
}
