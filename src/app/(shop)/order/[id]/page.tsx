import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/store/order-store";
import { OrderDetailView } from "@/components/shop/order-detail-view";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Order confirmed — Oliveto",
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
      <OrderDetailView order={order} showReturns />
    </div>
  );
}
