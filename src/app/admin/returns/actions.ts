"use server";

import { revalidatePath } from "next/cache";
import {
  getReturnById,
  updateReturn,
  type ReturnStatus,
} from "@/lib/store/returns-store";
import { getOrderById } from "@/lib/store/order-store";
import { integrations } from "@/lib/integrations";

async function email(to: string, subject: string, html: string) {
  await integrations.email.send({
    to,
    from: "returns@oliveto.com",
    subject,
    html,
  });
}

export async function adminApproveReturn(id: string) {
  const ret = await getReturnById(id);
  if (!ret) return { ok: false, error: "Not found" };
  const updated = await updateReturn(id, {
    status: "approved",
    resolvedAt: new Date().toISOString(),
  });
  await email(
    ret.customerEmail,
    `Return ${ret.id} approved`,
    `<p>Your return request <strong>${ret.id}</strong> has been approved.</p><p>Please send the items back to:</p><p>Oliveto Returns<br/>12 Redchurch Street<br/>London E2 7DP</p><p>We'll process your refund once the items arrive.</p>`
  );
  revalidatePath("/admin/returns");
  return { ok: true, return: updated };
}

export async function adminRejectReturn(id: string, notes: string) {
  const ret = await getReturnById(id);
  if (!ret) return { ok: false, error: "Not found" };
  const updated = await updateReturn(id, {
    status: "rejected",
    resolvedAt: new Date().toISOString(),
    adminNotes: notes,
  });
  await email(
    ret.customerEmail,
    `Return ${ret.id} update`,
    `<p>Unfortunately we cannot process your return request <strong>${ret.id}</strong>.</p><p>${notes}</p>`
  );
  revalidatePath("/admin/returns");
  return { ok: true, return: updated };
}

export async function adminMarkReturnReceived(id: string) {
  const updated = await updateReturn(id, { status: "received" });
  revalidatePath("/admin/returns");
  return { ok: true, return: updated };
}

export async function adminProcessRefund(id: string) {
  const ret = await getReturnById(id);
  if (!ret) return { ok: false, error: "Not found" };
  const order = await getOrderById(ret.orderId);
  if (!order) return { ok: false, error: "Order not found" };

  // Compute refund amount: sum the line items being returned.
  const refundAmount = ret.items.reduce((sum, item) => {
    const orderItem = order.items.find(
      (i) =>
        i.productId === item.productId && i.variantId === item.variantId
    );
    return sum + (orderItem?.snapshot.variantPrice ?? 0) * item.quantity;
  }, 0);

  // Reach through the PaymentProvider interface. `refundPayment` exists
  // on the mock — real adapters implement it for real.
  const paymentIntentId = `pi_mock_${order.id}`;
  await integrations.payment.refundPayment(paymentIntentId, refundAmount);

  const updated = await updateReturn(id, {
    status: "refunded",
    refundAmount,
    resolvedAt: new Date().toISOString(),
  });

  await email(
    ret.customerEmail,
    `Refund processed — ${ret.id}`,
    `<p>Your refund for return <strong>${ret.id}</strong> has been processed.</p><p>Refund amount: <strong>£${(refundAmount / 100).toFixed(2)}</strong>. It should appear in your account within 5-10 business days.</p>`
  );
  revalidatePath("/admin/returns");
  return { ok: true, return: updated };
}

export async function adminSetReturnStatus(
  id: string,
  status: ReturnStatus
) {
  const updated = await updateReturn(id, { status });
  revalidatePath("/admin/returns");
  return { ok: true, return: updated };
}
