"use server";

import { revalidatePath } from "next/cache";
import type { Product, OrderStatus } from "@/lib/types";
import {
  createProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "@/lib/store/product-store";
import { updateOrderStatus } from "@/lib/store/order-store";
import {
  getPendingAlertsForProduct,
  markAlertsNotified,
} from "@/lib/store/stock-alerts-store";
import { integrations } from "@/lib/integrations";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function adminCreateProduct(product: Product) {
  await createProduct(product);
  revalidateAll();
  return { success: true };
}

export async function adminUpdateProduct(id: string, patch: Partial<Product>) {
  const previous = await getProductBySlug(id);
  const result = await updateProduct(id, patch);
  if (result && previous) {
    await notifyRestockAlerts(previous, result);
  }
  revalidateAll();
  return result ? { success: true } : { success: false };
}

export async function adminDeleteProduct(id: string) {
  const result = await deleteProduct(id);
  revalidateAll();
  return result ? { success: true } : { success: false };
}

export async function adminUpdateOrderStatus(id: string, status: OrderStatus) {
  const result = await updateOrderStatus(id, status);
  revalidateAll();
  return result ? { success: true } : { success: false };
}

// ---------------------------------------------------------------------------
// When inventory goes from zero-or-less to positive on any variant, notify
// pending stock-alert subscribers for that product. We match per-variant
// alerts to the specific variant and product-wide alerts to any restocked
// variant.
// ---------------------------------------------------------------------------
async function notifyRestockAlerts(previous: Product, current: Product) {
  const prevByVariant = new Map(
    previous.variants.map((v) => [v.id, v.inventory])
  );

  const restockedVariantIds: string[] = [];
  for (const v of current.variants) {
    const wasOut = (prevByVariant.get(v.id) ?? 0) <= 0;
    if (wasOut && v.inventory > 0) {
      restockedVariantIds.push(v.id);
    }
  }

  if (restockedVariantIds.length === 0) return;

  // Product-wide alerts (no variant specified)
  const pending = await getPendingAlertsForProduct(current.id);
  const toNotify = pending.filter(
    (a) => !a.variantId || restockedVariantIds.includes(a.variantId)
  );
  if (toNotify.length === 0) return;

  for (const alert of toNotify) {
    await integrations.email.send({
      to: alert.email,
      from: "alerts@oliveto.com",
      subject: `${current.name} is back in stock`,
      html: `<p>Good news — <strong>${current.name}</strong> is back in stock at Oliveto.</p><p><a href="/product/${current.id}">Shop now</a></p>`,
    });
  }

  await markAlertsNotified(toNotify.map((a) => a.id));
  console.log(
    `[restock] notified ${toNotify.length} subscribers for ${current.id}`
  );
}
