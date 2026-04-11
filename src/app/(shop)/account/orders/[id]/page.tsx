import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { integrations } from "@/lib/integrations";
import { getOrderById } from "@/lib/store/order-store";
import { OrderDetailView } from "@/components/shop/order-detail-view";

type Props = { params: Promise<{ id: string }> };

export default async function AccountOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const customer = await integrations.auth.getCurrentCustomer();
  if (!customer) {
    redirect(`/account/signin?redirect=/account/orders/${id}`);
  }

  const order = await getOrderById(id);
  if (!order) notFound();

  // Ownership check: either customerId matches OR the order was placed
  // with the signed-in customer's email as a guest.
  const owns =
    order.customerId === customer.id ||
    (order.customerEmail &&
      order.customerEmail.toLowerCase() === customer.email.toLowerCase());
  if (!owns) {
    return (
      <div>
        <h1 className="font-display text-[32px] italic text-foreground">
          Order not found
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          We couldn&rsquo;t find that order linked to your account.
        </p>
        <Link
          href="/account/orders"
          className="mt-6 inline-flex h-10 items-center rounded-sm border border-olive/40 px-5 text-[11px] uppercase tracking-[0.15em] text-olive"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  return <OrderDetailView order={order} showReturns />;
}
