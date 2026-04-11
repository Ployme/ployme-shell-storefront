"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { subscribeToStockAlert } from "@/app/(shop)/product/[slug]/stock-alert-actions";

export function StockAlertForm({ product }: { product: Product }) {
  const [email, setEmail] = useState("");
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await subscribeToStockAlert({
        productId: product.id,
        variantId: product.variants.length > 1 ? variantId : undefined,
        email,
      });
      if (result.ok) {
        setMessage("You're on the list. We'll email you when it's back.");
        setEmail("");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="rounded-sm border border-stone p-5">
      <p className="font-display text-xl italic text-foreground">
        Let me know when it&rsquo;s back
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground">
        All variants are sold out. We&rsquo;ll email you as soon as it returns.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {product.variants.length > 1 && (
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.size}
              </option>
            ))}
          </select>
        )}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="h-10"
        />
        {error && <p className="text-xs text-terracotta">{error}</p>}
        {message && <p className="text-xs text-olive">{message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 w-full items-center justify-center rounded-sm bg-olive text-[11px] font-medium uppercase tracking-[0.15em] text-cream disabled:opacity-50"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : "Notify me"}
        </button>
      </form>
    </div>
  );
}
