"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/types";
import { validateDiscount } from "@/app/(shop)/cart/discount-actions";

export function DiscountInput() {
  const { subtotal, discount, applyDiscount, removeDiscount } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function apply() {
    if (!code.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await validateDiscount(code.trim(), subtotal);
      if (result.ok) {
        applyDiscount({
          code: result.code,
          amount: result.amount,
          type: result.type,
          value: result.value,
        });
        setCode("");
      } else {
        setError(result.error);
      }
    });
  }

  if (discount) {
    return (
      <div className="mt-4 flex items-center justify-between rounded-sm border border-olive/30 bg-olive/5 px-3 py-2">
        <div className="text-sm text-foreground">
          <span className="font-medium">{discount.code}</span>
          <span className="ml-2 text-muted-foreground">
            -{formatPrice(discount.amount)}
          </span>
        </div>
        <button
          onClick={removeDiscount}
          className="text-muted-foreground hover:text-terracotta"
          aria-label="Remove discount"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Discount code"
          className="h-10"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply();
            }
          }}
        />
        <button
          onClick={apply}
          disabled={pending || !code.trim()}
          className="h-10 rounded-sm border border-olive/40 px-4 text-[11px] font-medium uppercase tracking-[0.15em] text-olive disabled:opacity-50"
        >
          Apply
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-terracotta">{error}</p>}
    </div>
  );
}
