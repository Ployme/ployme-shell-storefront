"use client";

import { useState, useEffect, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/types";
import { estimateShipping } from "@/app/(shop)/product/[slug]/shipping-actions";

const STORAGE_KEY = "oliveto-shipping-postcode";
const DEFAULT_POSTCODE = "E2 7DP";

export function ShippingEstimate({
  weight,
  defaultEstimate = 450,
}: {
  weight: number;
  defaultEstimate?: number;
}) {
  const [open, setOpen] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [estimate, setEstimate] = useState<number>(defaultEstimate);
  const [name, setName] = useState<string>("Standard UK");
  const [pending, startTransition] = useTransition();

  // Load saved postcode on mount and auto-run an estimate with it.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      // Hydrating saved postcode on mount — legitimate setState-in-effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPostcode(saved);
      startTransition(async () => {
        const result = await estimateShipping({ postcode: saved, weight });
        if (result) {
          setEstimate(result.estimate);
          setName(result.name);
        }
      });
    }
  }, [weight]);

  function lookup() {
    const trimmed = postcode.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    startTransition(async () => {
      const result = await estimateShipping({ postcode: trimmed, weight });
      if (result) {
        setEstimate(result.estimate);
        setName(result.name);
      }
    });
  }

  return (
    <div className="mt-4 border-t border-stone pt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Shipping from {formatPrice(estimate)}{" "}
          <span className="normal-case text-muted-foreground/80">
            · {name}
          </span>
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-3">
          <label className="block text-[12px] text-muted-foreground">
            Enter your postcode
          </label>
          <div className="mt-2 flex gap-2">
            <Input
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder={DEFAULT_POSTCODE}
              className="h-10"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  lookup();
                }
              }}
            />
            <button
              onClick={lookup}
              disabled={pending}
              className="h-10 rounded-sm border border-olive/40 px-4 text-[11px] uppercase tracking-[0.15em] text-olive disabled:opacity-50"
            >
              Check
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
