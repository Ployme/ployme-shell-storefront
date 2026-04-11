"use server";

import { integrations } from "@/lib/integrations";

export type DiscountLookupResult =
  | {
      ok: true;
      code: string;
      amount: number;
      type: "percentage" | "fixed";
      value: number;
    }
  | { ok: false; error: string };

export async function validateDiscount(
  code: string,
  subtotal: number
): Promise<DiscountLookupResult> {
  const customer = await integrations.auth.getCurrentCustomer();
  const result = await integrations.discounts.validate({
    code,
    subtotal,
    customerEmail: customer?.email,
  });
  if (!result.ok) {
    return { ok: false, error: result.message };
  }
  return {
    ok: true,
    code: result.result.discount.code,
    amount: result.result.amount,
    type: result.result.discount.type,
    value: result.result.discount.value,
  };
}
