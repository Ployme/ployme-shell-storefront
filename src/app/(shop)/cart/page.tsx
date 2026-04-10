"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/types";
import { ProductImage } from "@/components/shop/product-image";

const FREE_SHIPPING_THRESHOLD = 4000; // £40 in pence
const SHIPPING_COST = 450; // £4.50

export default function CartPage() {
  const { cart, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const router = useRouter();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
        Your basket
      </p>
      <h1 className="mt-3 font-display text-[48px] italic leading-[1.05] tracking-tight text-foreground lg:text-[56px]">
        Basket
      </h1>

      {itemCount === 0 ? (
        /* ── Empty state ────────────────────────────────── */
        <div className="mt-16 mb-24">
          <p className="font-display text-2xl italic leading-relaxed text-foreground lg:text-3xl">
            Nothing here yet.
          </p>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Start with a bottle we think you&rsquo;ll love. Every oil in the
            range was tasted, argued over, and chosen because it belongs on a
            good table.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-sm border border-olive/40 px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-olive transition-colors hover:border-olive"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        /* ── Cart with items ────────────────────────────── */
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          {/* Left: item list */}
          <div>
            {cart.items.map((item, i) => {
              const { snapshot } = item;
              const linePrice = snapshot.variantPrice * item.quantity;

              return (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className={`flex gap-5 py-6 ${i > 0 ? "border-t border-stone" : ""}`}
                >
                  {/* Product image */}
                  <div className="shrink-0 overflow-hidden rounded-sm">
                    <ProductImage
                      src={snapshot.image}
                      alt={snapshot.productName}
                      productName={snapshot.productName}
                      collectionName={snapshot.collectionName}
                      className="size-[120px]"
                      size="sm"
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${snapshot.productSlug}`}
                        className="font-display text-xl italic leading-tight text-foreground transition-colors hover:text-olive"
                      >
                        {snapshot.productName}
                      </Link>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {snapshot.variantSize}
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">
                        {snapshot.origin}
                      </p>
                    </div>
                    <p className="mt-3 text-base tabular-nums text-foreground">
                      {formatPrice(linePrice)}
                    </p>
                  </div>

                  {/* Quantity + remove */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="inline-flex items-center rounded-sm border border-olive/30">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-stone/30 disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="flex h-8 w-9 items-center justify-center text-sm tabular-nums font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity + 1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-stone/30 disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        removeItem(item.productId, item.variantId)
                      }
                      className="text-[12px] text-muted-foreground transition-colors hover:text-terracotta"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: order summary */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-sm border border-stone p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Summary
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span
                    className={`tabular-nums ${shipping === 0 ? "text-terracotta" : "text-foreground"}`}
                  >
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-stone" />

              <div className="flex justify-between">
                <span className="font-display text-lg italic text-foreground">
                  Total
                </span>
                <span className="font-display text-lg italic tabular-nums text-foreground">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="mt-6 flex h-14 w-full items-center justify-center rounded-sm bg-olive text-[12px] font-medium uppercase tracking-[0.15em] text-cream transition-transform duration-100 active:scale-[0.97]"
              >
                Proceed to checkout
              </button>

              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                {amountToFreeShipping > 0 ? (
                  <span className="text-terracotta">
                    Add {formatPrice(amountToFreeShipping)} more for free UK
                    shipping
                  </span>
                ) : (
                  "Free shipping applied"
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
