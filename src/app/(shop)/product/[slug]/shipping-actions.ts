"use server";

import { integrations } from "@/lib/integrations";

export async function estimateShipping(params: {
  postcode: string;
  weight: number;
}): Promise<{
  estimate: number;
  name: string;
} | null> {
  const rates = await integrations.shipping.getRates({
    destination: {
      line1: "",
      city: "",
      postcode: params.postcode,
      country: "GB",
    },
    subtotal: 0, // no cart context on product page
    weight: params.weight,
  });
  if (rates.length === 0) return null;
  // Prefer a paid standard rate — the free threshold doesn't apply on a
  // product page because the subtotal is always zero.
  const paid = rates.find((r) => r.price > 0) ?? rates[0];
  return { estimate: paid.price, name: paid.name };
}
