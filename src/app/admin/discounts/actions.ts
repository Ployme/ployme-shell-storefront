"use server";

import { revalidatePath } from "next/cache";
import { integrations } from "@/lib/integrations";
import type { Discount } from "@/lib/integrations";

export async function adminListDiscounts(): Promise<Discount[]> {
  return integrations.discounts.list();
}

export async function adminCreateDiscount(discount: Discount) {
  const result = await integrations.discounts.create(discount);
  revalidatePath("/admin/discounts");
  return result;
}

export async function adminUpdateDiscount(id: string, patch: Partial<Discount>) {
  const result = await integrations.discounts.update(id, patch);
  revalidatePath("/admin/discounts");
  return result;
}

export async function adminDeleteDiscount(id: string) {
  const result = await integrations.discounts.delete(id);
  revalidatePath("/admin/discounts");
  return { ok: result };
}
