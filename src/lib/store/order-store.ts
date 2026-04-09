// In-memory order store seeded from sample data.
// Mutations live only for the lifetime of the serverless instance —
// this is intentional. We're a reference shell, not a real backend.

import "server-only";

import type { Order, OrderStatus } from "@/lib/types";
import { SAMPLE_ORDERS } from "@/lib/data/sample-orders";

let orders: Order[] = [...SAMPLE_ORDERS];

export async function getAllOrders(): Promise<Order[]> {
  return orders;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  return orders.find((o) => o.id === id);
}

export async function createOrder(order: Order): Promise<Order> {
  orders.push(order);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | undefined> {
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return undefined;
  orders[index] = { ...orders[index], status };
  return orders[index];
}
