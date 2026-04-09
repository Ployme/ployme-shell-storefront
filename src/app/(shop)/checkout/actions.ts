"use server";

import type { Order } from "@/lib/types";
import { createOrder } from "@/lib/store/order-store";

export async function placeOrder(order: Order): Promise<{ id: string }> {
  await createOrder(order);
  return { id: order.id };
}
