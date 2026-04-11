"use server";

import type { Order, Address, Customer } from "@/lib/types";
import { createOrder } from "@/lib/store/order-store";
import { integrations } from "@/lib/integrations";
import type { ShippingRate } from "@/lib/integrations";
import { getVatRateForCountry, computeVatBreakdown } from "@/lib/vat";
import { markAbandonmentRecoveredByEmail } from "@/lib/store/abandoned-carts-store";

export async function getCustomerDefaults(): Promise<Customer | null> {
  return integrations.auth.getCurrentCustomer();
}

export async function getShippingRates(
  destination: Address,
  subtotal: number
): Promise<ShippingRate[]> {
  return integrations.shipping.getRates({ destination, subtotal });
}

export async function computeTotals(input: {
  subtotal: number;
  shipping: number;
  country: string;
  discountCode?: string;
  email?: string;
}): Promise<{
  subtotalExVat: number;
  vatAmount: number;
  vatRate: number;
  discountAmount: number;
  total: number;
}> {
  // Apply discount to gross subtotal
  let discountAmount = 0;
  if (input.discountCode) {
    const result = await integrations.discounts.validate({
      code: input.discountCode,
      subtotal: input.subtotal,
      customerEmail: input.email,
    });
    if (result.ok) {
      discountAmount = result.result.amount;
    }
  }

  const grossAfterDiscount = Math.max(0, input.subtotal - discountAmount);
  const vatRate = getVatRateForCountry(input.country);
  const { subtotalExVat, vatAmount } = computeVatBreakdown(
    grossAfterDiscount,
    vatRate
  );

  return {
    subtotalExVat,
    vatAmount,
    vatRate,
    discountAmount,
    total: grossAfterDiscount + input.shipping,
  };
}

export async function placeOrder(input: {
  order: Order;
  discountCode?: string;
}): Promise<{ orderId: string }> {
  const { order, discountCode } = input;

  // Process payment through the payment provider
  const intent = await integrations.payment.createPaymentIntent({
    amount: order.total,
    currency: "GBP",
    orderId: order.id,
    metadata: { customerId: order.customerId },
  });

  console.log(
    `[placeOrder] payment intent ${intent.id} — status: ${intent.status}`
  );

  // Record discount usage
  if (discountCode) {
    const discount = await integrations.discounts.getByCode(discountCode);
    if (discount) {
      await integrations.discounts.recordUsage(
        discount.id,
        order.customerEmail
      );
    }
  }

  // Persist the order
  await createOrder(order);

  // Mark any abandonment for this email as recovered
  if (order.customerEmail) {
    await markAbandonmentRecoveredByEmail(order.customerEmail);
  }

  // Send confirmation email
  const vatLine =
    typeof order.vatAmount === "number" && order.vatAmount > 0
      ? `<p>Subtotal (ex VAT): &pound;${((order.subtotalExVat ?? 0) / 100).toFixed(2)}<br/>VAT: &pound;${((order.vatAmount ?? 0) / 100).toFixed(2)}</p>`
      : "";
  await integrations.email.send({
    to: order.customerEmail ?? "customer@example.com",
    from: "orders@oliveto.com",
    subject: `Order confirmed — ${order.id}`,
    html: [
      `<h1>Thank you for your order</h1>`,
      `<p>Order <strong>${order.id}</strong> has been confirmed.</p>`,
      vatLine,
      `<p>Total: &pound;${(order.total / 100).toFixed(2)}</p>`,
    ].join("\n"),
  });

  return { orderId: order.id };
}
