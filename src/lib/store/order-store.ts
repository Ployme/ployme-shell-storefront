import "server-only";

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Order, OrderStatus } from "@/lib/types";
import { SAMPLE_ORDERS } from "@/lib/data/sample-orders";

const DATA_DIR = path.join(process.cwd(), "src/lib/data");
const JSON_PATH = path.join(DATA_DIR, "orders.json");

async function readStore(): Promise<Order[]> {
  if (!existsSync(JSON_PATH)) {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(JSON_PATH, JSON.stringify(SAMPLE_ORDERS, null, 2), "utf-8");
    return SAMPLE_ORDERS;
  }
  const raw = await readFile(JSON_PATH, "utf-8");
  return JSON.parse(raw) as Order[];
}

async function writeStore(orders: Order[]): Promise<void> {
  await writeFile(JSON_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

export async function getAllOrders(): Promise<Order[]> {
  return readStore();
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await readStore();
  return orders.find((o) => o.id === id);
}

export async function createOrder(order: Order): Promise<Order> {
  const orders = await readStore();
  orders.push(order);
  await writeStore(orders);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | undefined> {
  const orders = await readStore();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return undefined;
  orders[index] = { ...orders[index], status };
  await writeStore(orders);
  return orders[index];
}
