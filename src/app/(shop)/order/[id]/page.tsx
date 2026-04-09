import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getOrderById } from "@/lib/store/order-store";
import { PRODUCTS } from "@/lib/data/products";
import { formatPrice } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Order confirmed — Oliveto",
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  // Our Order type doesn't store customer name directly — resolve from
  // the sample customer for the demo. A real app would join on customerId.
  const customerFirstName =
    order.customerId === "cust-001" ? "Elena" : "there";

  const enrichedItems = order.items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return null;
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) return null;
      return { item, product, variant };
    })
    .filter(Boolean);

  const addr = order.shippingAddress;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
      {/* Check mark */}
      <div className="flex size-12 items-center justify-center rounded-full bg-terracotta/10">
        <Check className="size-6 text-terracotta" />
      </div>

      {/* Heading */}
      <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
        Order confirmed
      </p>
      <h1 className="mt-3 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground lg:text-[48px]">
        Thank you, {customerFirstName}.
      </h1>
      <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
        We&rsquo;ve received your order and will pack it carefully in our
        Shoreditch store. You&rsquo;ll get a shipping confirmation in the
        next 24 hours.
      </p>

      {/* Order card */}
      <div className="mt-12 rounded-sm border border-stone p-6">
        <p className="font-display text-lg italic text-foreground">
          Order #{order.id}
        </p>

        <div className="mt-6 space-y-4">
          {enrichedItems.map((entry) => {
            if (!entry) return null;
            const { item, product, variant } = entry;
            return (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {product.name}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {variant.size} × {item.quantity}
                  </p>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-foreground">
                  {formatPrice(variant.price * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="my-5 h-px bg-stone" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums text-foreground">
              {formatPrice(order.subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span
              className={`tabular-nums ${order.shipping === 0 ? "text-terracotta" : "text-foreground"}`}
            >
              {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
            </span>
          </div>
        </div>

        <div className="my-4 h-px bg-stone" />

        <div className="flex justify-between">
          <span className="font-display text-lg italic text-foreground">
            Total
          </span>
          <span className="font-display text-lg italic tabular-nums text-foreground">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>

      {/* Shipping address */}
      <div className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Shipping to
        </p>
        <div className="mt-3 text-sm leading-relaxed text-foreground">
          <p>{addr.line1}</p>
          {addr.line2 && <p>{addr.line2}</p>}
          <p>
            {addr.city}, {addr.postcode}
          </p>
          <p>{addr.country}</p>
        </div>
      </div>

      {/* Continue shopping */}
      <Link
        href="/shop"
        className="mt-12 inline-flex h-12 items-center justify-center rounded-sm border border-olive/40 px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-olive transition-colors hover:border-olive"
      >
        Continue shopping
      </Link>
    </div>
  );
}
