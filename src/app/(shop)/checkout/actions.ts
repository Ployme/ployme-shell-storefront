"use server";

import type { Order, Address, Customer } from "@/lib/types";
import { createOrder } from "@/lib/store/order-store";
import { integrations } from "@/lib/integrations";
import type { ShippingRate } from "@/lib/integrations";

export async function getCustomerDefaults(): Promise<Customer | null> {
  return integrations.auth.getCurrentCustomer();
}

export async function getShippingRates(
  destination: Address,
  subtotal: number
): Promise<ShippingRate[]> {
  return integrations.shipping.getRates({ destination, subtotal });
}

export async function placeOrder(order: Order): Promise<{ orderId: string }> {
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

  // Persist the order
  await createOrder(order);

  // Send confirmation email
  const customer = await integrations.auth.getCurrentCustomer();
  await integrations.email.send({
    to: customer?.email ?? "customer@example.com",
    from: "orders@oliveto.com",
    subject: `Order confirmed — ${order.id}`,
    html: [
      `<h1>Thank you for your order</h1>`,
      `<p>Order <strong>${order.id}</strong> has been confirmed.</p>`,
      `<p>Total: &pound;${(order.total / 100).toFixed(2)}</p>`,
    ].join("\n"),
  });

  return { orderId: order.id };
}
