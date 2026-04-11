"use server";

import { integrations } from "@/lib/integrations";
import { createStockAlert } from "@/lib/store/stock-alerts-store";
import { getProductBySlug } from "@/lib/store/product-store";

export async function subscribeToStockAlert(input: {
  productId: string;
  variantId?: string;
  email: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.email || !input.email.includes("@")) {
    return { ok: false, error: "Enter a valid email" };
  }

  const product = await getProductBySlug(input.productId);
  if (!product) return { ok: false, error: "Product not found" };

  await createStockAlert({
    productId: input.productId,
    variantId: input.variantId,
    email: input.email.trim().toLowerCase(),
  });

  await integrations.email.send({
    to: input.email,
    from: "alerts@oliveto.com",
    subject: `We'll let you know when ${product.name} is back`,
    html: `<p>Thanks! We'll email you as soon as <strong>${product.name}</strong> is back in stock.</p>`,
  });

  return { ok: true };
}
