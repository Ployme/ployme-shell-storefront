"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/types";
import type { Order } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  placeOrder,
  getCustomerDefaults,
  getShippingRates,
  computeTotals,
} from "./actions";
import { captureAbandonment } from "./abandonment-actions";

const COUNTRIES = [
  "United Kingdom",
  "Ireland",
  "France",
  "Italy",
];

export default function CheckoutPage() {
  const { cart, subtotal, itemCount, clearCart, discount } = useCart();
  const [placing, setPlacing] = useState(false);

  // Form state — populated from auth provider on mount
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [loaded, setLoaded] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  // Shipping — populated from shipping provider
  const [shipping, setShipping] = useState(0);

  // VAT totals from computeTotals
  const [totals, setTotals] = useState<{
    subtotalExVat: number;
    vatAmount: number;
    vatRate: number;
    discountAmount: number;
    total: number;
  }>({
    subtotalExVat: subtotal,
    vatAmount: 0,
    vatRate: 0.20,
    discountAmount: discount?.amount ?? 0,
    total: subtotal,
  });

  // Load customer defaults from auth provider
  useEffect(() => {
    getCustomerDefaults().then((customer) => {
      if (customer) {
        setSignedIn(true);
        setEmail(customer.email);
        setName(customer.name);
        const addr = customer.addresses[0];
        if (addr) {
          setLine1(addr.line1);
          setLine2(addr.line2 ?? "");
          setCity(addr.city);
          setPostcode(addr.postcode);
        }
      }
      setLoaded(true);
    });
  }, []);

  // Fetch shipping rates from shipping provider when inputs change
  const fetchShipping = useCallback(async () => {
    if (!postcode || !city) return;
    const rates = await getShippingRates(
      { line1, line2: line2 || undefined, city, postcode, country },
      subtotal
    );
    if (rates.length > 0) {
      setShipping(rates[0].price);
    }
  }, [line1, line2, city, postcode, country, subtotal]);

  useEffect(() => {
    if (loaded && !placing && itemCount > 0) {
      // fetchShipping is async and calls setState inside its promise — the
      // lint rule flags any function call that transitively sets state, but
      // this is the intended shipping-rate refresh pattern.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchShipping();
    }
  }, [loaded, placing, itemCount, fetchShipping]);

  // Recompute VAT + discount totals whenever relevant inputs change
  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    computeTotals({
      subtotal,
      shipping,
      country,
      discountCode: discount?.code,
      email: email || undefined,
    }).then((t) => {
      if (!cancelled) setTotals(t);
    });
    return () => {
      cancelled = true;
    };
  }, [loaded, subtotal, shipping, country, discount?.code, email]);

  // Abandoned-cart capture: after email is entered, wait 15 minutes and
  // if the order hasn't been placed, record an abandonment via the store.
  const abandonmentArmed = useRef(false);
  useEffect(() => {
    if (!email || !email.includes("@") || itemCount === 0) return;
    if (abandonmentArmed.current) return;
    abandonmentArmed.current = true;
    const timer = setTimeout(
      () => {
        if (!placing) {
          captureAbandonment({
            email,
            items: cart.items,
            subtotal,
          }).catch(() => {});
        }
      },
      15 * 60 * 1000
    );
    return () => clearTimeout(timer);
  }, [email, itemCount, placing, cart.items, subtotal]);

  const canSubmit =
    email.includes("@") &&
    name.trim().length > 0 &&
    line1.trim().length > 0 &&
    city.trim().length > 0 &&
    postcode.trim().length > 0 &&
    itemCount > 0;

  async function handlePlaceOrder() {
    if (!canSubmit || placing) return;
    setPlacing(true);

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const customer = await getCustomerDefaults();

    const order: Order = {
      id: orderId,
      customerId: customer?.id ?? "guest",
      customerEmail: email,
      items: cart.items,
      subtotal,
      subtotalExVat: totals.subtotalExVat,
      vatAmount: totals.vatAmount,
      vatRate: totals.vatRate,
      discountAmount: totals.discountAmount || undefined,
      discountCode: discount?.code,
      shipping,
      total: totals.total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      shippingAddress: {
        line1,
        line2: line2 || undefined,
        city,
        postcode,
        country,
      },
    };

    try {
      const result = await placeOrder({
        order,
        discountCode: discount?.code,
      });
      clearCart();
      window.location.href = `/order/${result.orderId}`;
    } catch (err) {
      console.error("[checkout] place order failed:", err);
      setPlacing(false);
    }
  }

  if (itemCount === 0 && !placing) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
          Checkout
        </p>
        <h1 className="mt-3 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground lg:text-[48px]">
          Your basket is empty
        </h1>
        <p className="mt-6 text-[15px] text-muted-foreground">
          Add some oils before checking out.
        </p>
        <Link
          href="/cart"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-sm border border-olive/40 px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-olive transition-colors hover:border-olive"
        >
          Back to basket
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
        Checkout
      </p>
      <h1 className="mt-3 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground lg:text-[48px]">
        Almost there
      </h1>

      {!signedIn && loaded && (
        <p className="mt-4 text-sm text-muted-foreground">
          Have an account?{" "}
          <Link
            href="/account/signin?redirect=/checkout"
            className="text-olive underline underline-offset-2"
          >
            Sign in
          </Link>{" "}
          for faster checkout.
        </p>
      )}

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        {/* Left: form */}
        <div className="space-y-10">
          {/* Contact */}
          <section>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Contact
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-10"
                />
              </div>
            </div>
          </section>

          {/* Shipping address */}
          <section>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Shipping address
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 h-10"
                />
              </div>
              <div>
                <Label htmlFor="line1">Address line 1</Label>
                <Input
                  id="line1"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="mt-1.5 h-10"
                />
              </div>
              <div>
                <Label htmlFor="line2">
                  Address line 2{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="line2"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="mt-1.5 h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1.5 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="mt-1.5 h-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Payment (demo) */}
          <section>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Payment
            </p>
            <p className="mt-2 text-[11px] text-terracotta">
              Demo checkout — no real payment will be taken
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="card">Card number</Label>
                <Input
                  id="card"
                  placeholder="4242 4242 4242 4242"
                  disabled
                  className="mt-1.5 h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    placeholder="12/28"
                    disabled
                    className="mt-1.5 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    disabled
                    className="mt-1.5 h-10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Place order button */}
          <button
            onClick={handlePlaceOrder}
            disabled={!canSubmit || placing}
            className="flex h-14 w-full items-center justify-center rounded-sm bg-olive text-[12px] font-medium uppercase tracking-[0.15em] text-cream transition-transform duration-100 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100"
          >
            {placing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Place order"
            )}
          </button>
        </div>

        {/* Right: order summary */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-sm border border-stone p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Your order
            </p>

            <div className="mt-4 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.snapshot.productName}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {item.snapshot.variantSize} × {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-foreground">
                    {formatPrice(item.snapshot.variantPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-5 h-px bg-stone" />

            <div className="space-y-3 text-sm">
              {totals.vatAmount > 0 ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal (ex VAT)
                    </span>
                    <span className="tabular-nums text-foreground">
                      {formatPrice(totals.subtotalExVat)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      VAT ({Math.round(totals.vatRate * 100)}%)
                    </span>
                    <span className="tabular-nums text-foreground">
                      {formatPrice(totals.vatAmount)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              )}
              {totals.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Discount{discount ? ` (${discount.code})` : ""}
                  </span>
                  <span className="tabular-nums text-terracotta">
                    -{formatPrice(totals.discountAmount)}
                  </span>
                </div>
              )}
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
                {formatPrice(totals.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
