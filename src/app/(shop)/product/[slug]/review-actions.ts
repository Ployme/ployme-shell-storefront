"use server";

import { revalidatePath } from "next/cache";
import { integrations } from "@/lib/integrations";
import {
  createReview,
  getReviewsForProduct,
  type Review,
} from "@/lib/store/reviews-store";
import { getOrdersForCustomer, getOrdersByEmail } from "@/lib/store/order-store";
import { getProductBySlug } from "@/lib/store/product-store";

async function customerHasPurchased(
  productId: string,
  customerId?: string,
  email?: string
): Promise<boolean> {
  let orders = [];
  if (customerId) {
    orders = await getOrdersForCustomer(customerId, email);
  } else if (email) {
    orders = await getOrdersByEmail(email);
  } else {
    return false;
  }
  return orders.some((o) => o.items.some((i) => i.productId === productId));
}

export async function submitReview(input: {
  productId: string;
  rating: number;
  title: string;
  body: string;
  name?: string;
  email?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.title.trim() || !input.body.trim()) {
    return { ok: false, error: "Title and review body are required" };
  }
  if (input.rating < 1 || input.rating > 5) {
    return { ok: false, error: "Rating must be between 1 and 5" };
  }

  const customer = await integrations.auth.getCurrentCustomer();
  const customerName = customer?.name ?? input.name?.trim() ?? "";
  const customerEmail = customer?.email ?? input.email?.trim().toLowerCase() ?? "";
  if (!customerName || !customerEmail) {
    return { ok: false, error: "Name and email are required" };
  }

  const product = await getProductBySlug(input.productId);
  if (!product) return { ok: false, error: "Product not found" };

  const verifiedPurchase = await customerHasPurchased(
    input.productId,
    customer?.id,
    customerEmail
  );

  await createReview({
    productId: input.productId,
    customerId: customer?.id,
    customerEmail,
    customerName,
    rating: input.rating,
    title: input.title.trim(),
    body: input.body.trim(),
    verifiedPurchase,
  });

  await integrations.email.send({
    to: customerEmail,
    from: "reviews@oliveto.com",
    subject: "Thanks for your review",
    html: `<p>Thanks for reviewing <strong>${product.name}</strong>. Your review is awaiting moderation and will be published shortly.</p>`,
  });
  await integrations.email.send({
    to: "admin@oliveto.com",
    from: "reviews@oliveto.com",
    subject: `New review pending — ${product.name}`,
    html: `<p>A new review for ${product.name} is awaiting moderation.</p>`,
  });

  revalidatePath(`/product/${input.productId}`);
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function getApprovedReviewsForProduct(
  productId: string
): Promise<Review[]> {
  return getReviewsForProduct(productId, "approved");
}
