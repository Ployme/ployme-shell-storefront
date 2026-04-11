import Link from "next/link";
import { Check } from "lucide-react";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { getReturnsForOrder } from "@/lib/store/returns-store";
import { RequestReturnButton } from "./request-return-button";

// Shared order-detail panel used by the guest confirmation page
// (/order/[id]) and the signed-in customer view (/account/orders/[id]).
// The signed-in variant turns on the return-request affordance.

function eligibleForReturn(order: Order): boolean {
  if (order.status !== "confirmed" && order.status !== "shipped") return false;
  const age = Date.now() - new Date(order.createdAt).getTime();
  return age < 30 * 24 * 60 * 60 * 1000;
}

export async function OrderDetailView({
  order,
  showReturns = false,
}: {
  order: Order;
  showReturns?: boolean;
}) {
  const addr = order.shippingAddress;
  const returns = showReturns ? await getReturnsForOrder(order.id) : [];

  const subtotalExVat = order.subtotalExVat ?? order.subtotal;
  const hasVat =
    typeof order.vatAmount === "number" && order.vatAmount > 0;
  const discount = order.discountAmount ?? 0;

  return (
    <div>
      <div className="flex size-12 items-center justify-center rounded-full bg-terracotta/10">
        <Check className="size-6 text-terracotta" />
      </div>

      <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
        Order {order.status}
      </p>
      <h1 className="mt-3 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground lg:text-[48px]">
        Order #{order.id}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Placed{" "}
        {new Date(order.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      <div className="mt-10 rounded-sm border border-stone p-6">
        <p className="font-display text-lg italic text-foreground">Items</p>

        <div className="mt-4 space-y-4">
          {order.items.map((item) => {
            const snap = item.snapshot;
            const name = snap?.productName ?? item.productId;
            const size = snap?.variantSize ?? item.variantId;
            const price = snap?.variantPrice ?? 0;
            return (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{name}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {size} × {item.quantity}
                  </p>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-foreground">
                  {formatPrice(price * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="my-5 h-px bg-stone" />

        <div className="space-y-2 text-sm">
          {hasVat ? (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal (ex VAT)</span>
                <span className="tabular-nums text-foreground">
                  {formatPrice(subtotalExVat)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  VAT{" "}
                  {typeof order.vatRate === "number"
                    ? `(${Math.round(order.vatRate * 100)}%)`
                    : ""}
                </span>
                <span className="tabular-nums text-foreground">
                  {formatPrice(order.vatAmount ?? 0)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums text-foreground">
                {formatPrice(order.subtotal)}
              </span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Discount{order.discountCode ? ` (${order.discountCode})` : ""}
              </span>
              <span className="tabular-nums text-terracotta">
                -{formatPrice(discount)}
              </span>
            </div>
          )}
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

      {showReturns && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Returns
            </p>
            {eligibleForReturn(order) && (
              <RequestReturnButton order={order} />
            )}
          </div>
          {returns.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No return requests on this order.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {returns.map((r) => (
                <li
                  key={r.id}
                  className="rounded-sm border border-stone px-4 py-3 text-sm"
                >
                  <p className="font-medium text-foreground">
                    {r.id} — {r.status}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    Requested{" "}
                    {new Date(r.requestedAt).toLocaleDateString("en-GB")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Link
        href="/shop"
        className="mt-12 inline-flex h-12 items-center justify-center rounded-sm border border-olive/40 px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-olive transition-colors hover:border-olive"
      >
        Continue shopping
      </Link>
    </div>
  );
}
