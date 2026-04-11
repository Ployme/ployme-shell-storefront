"use server";

import type { CartItem } from "@/lib/types";
import { upsertAbandonment } from "@/lib/store/abandoned-carts-store";

export async function captureAbandonment(input: {
  email: string;
  items: CartItem[];
  subtotal: number;
}): Promise<void> {
  if (!input.email || !input.email.includes("@")) return;
  if (input.items.length === 0) return;
  await upsertAbandonment({
    customerEmail: input.email,
    items: input.items,
    subtotal: input.subtotal,
  });
}
