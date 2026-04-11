"use server";

import { revalidatePath } from "next/cache";
import { integrations } from "@/lib/integrations";
import { getOrderById } from "@/lib/store/order-store";
import {
  createReturn,
  getAllReturns,
  nextReturnId,
  type ReturnItem,
} from "@/lib/store/returns-store";

// ---------------------------------------------------------------------------
// Customer-facing return request action.
// Admin-side approve/reject/refund lives in src/app/admin/returns/actions.ts.
// ---------------------------------------------------------------------------

export async function requestReturnAction(input: {
  orderId: string;
  items: ReturnItem[];
  message: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.items.length) {
    return { ok: false, error: "Select at least one item" };
  }
  const order = await getOrderById(input.orderId);
  if (!order) return { ok: false, error: "Order not found" };

  const customer = await integrations.auth.getCurrentCustomer();
  // Accept guest return requests as well — ownership is by email.
  const customerEmail =
    customer?.email ?? order.customerEmail ?? "guest@example.com";

  const all = await getAllReturns();
  const request = await createReturn({
    id: nextReturnId(all),
    orderId: input.orderId,
    customerId: customer?.id,
    customerEmail,
    items: input.items,
    status: "pending",
    requestedAt: new Date().toISOString(),
    customerMessage: input.message || undefined,
  });

  // Email customer + admin through the EmailProvider.
  await integrations.email.send({
    to: customerEmail,
    from: "returns@oliveto.com",
    subject: `Return request received — ${request.id}`,
    html: `<p>We've received your return request <strong>${request.id}</strong> for order <strong>${order.id}</strong>. Our team will review it shortly.</p>`,
  });
  await integrations.email.send({
    to: "admin@oliveto.com",
    from: "returns@oliveto.com",
    subject: `New return request ${request.id}`,
    html: `<p>New return request ${request.id} for order ${order.id}.</p>`,
  });

  revalidatePath(`/account/orders/${order.id}`);
  revalidatePath(`/order/${order.id}`);
  revalidatePath("/admin/returns");
  return { ok: true };
}
