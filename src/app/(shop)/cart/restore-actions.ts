"use server";

import type { CartItem } from "@/lib/types";
import { getAbandonmentById } from "@/lib/store/abandoned-carts-store";

export async function restoreAbandonedCart(
  token: string
): Promise<CartItem[] | null> {
  const row = await getAbandonmentById(token);
  if (!row) return null;
  return row.items;
}
