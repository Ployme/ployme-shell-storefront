import Link from "next/link";
import { redirect } from "next/navigation";
import { integrations } from "@/lib/integrations";
import { getOrdersForCustomer } from "@/lib/store/order-store";
import { formatPrice } from "@/lib/types";
import { OrderHistoryClient } from "./history-client";

export default async function AccountOrdersPage() {
  const customer = await integrations.auth.getCurrentCustomer();
  if (!customer) redirect("/account/signin?redirect=/account/orders");

  const orders = (await getOrdersForCustomer(customer.id, customer.email))
    .slice()
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Orders
      </p>
      <h1 className="mt-2 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground">
        Your orders
      </h1>
      <div className="mt-8">
        <OrderHistoryClient
          orders={orders.map((o) => ({
            id: o.id,
            createdAt: o.createdAt,
            total: o.total,
            status: o.status,
            totalDisplay: formatPrice(o.total),
            itemSummary: o.items
              .map((i) => `${i.snapshot.productName} ×${i.quantity}`)
              .join(", "),
          }))}
        />
        {orders.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            You haven&rsquo;t placed any orders yet.{" "}
            <Link
              href="/shop"
              className="text-olive underline underline-offset-2"
            >
              Browse the collection
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
