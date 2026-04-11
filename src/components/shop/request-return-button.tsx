"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Order } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requestReturnAction } from "@/app/(shop)/account/returns-actions";

const REASONS = [
  "Wrong size",
  "Damaged",
  "Not as described",
  "Changed mind",
  "Other",
];

export function RequestReturnButton({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [selections, setSelections] = useState<
    Record<string, { checked: boolean; quantity: number; reason: string }>
  >(() =>
    Object.fromEntries(
      order.items.map((item) => [
        `${item.productId}::${item.variantId}`,
        { checked: false, quantity: item.quantity, reason: REASONS[0] },
      ])
    )
  );
  const [message, setMessage] = useState("");

  function toggle(key: string) {
    setSelections((prev) => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key].checked },
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const items = Object.entries(selections)
      .filter(([, s]) => s.checked)
      .map(([key, s]) => {
        const [productId, variantId] = key.split("::");
        return {
          productId,
          variantId,
          quantity: s.quantity,
          reason: s.reason,
        };
      });
    if (items.length === 0) {
      setError("Select at least one item to return");
      return;
    }
    startTransition(async () => {
      const result = await requestReturnAction({
        orderId: order.id,
        items,
        message,
      });
      if (result.ok) {
        setDone(true);
      } else {
        setError(result.error ?? "Something went wrong");
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center rounded-sm border border-olive/40 px-4 text-[11px] font-medium uppercase tracking-[0.15em] text-olive"
      >
        Request return
      </button>
    );
  }

  if (done) {
    return (
      <div className="mt-4 rounded-sm border border-olive/40 bg-olive/5 p-4">
        <p className="text-sm text-foreground">
          Your return request has been submitted. We&rsquo;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-sm border border-stone p-5">
      <p className="font-display text-lg italic text-foreground">
        Request a return
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-5">
        <div className="space-y-3">
          {order.items.map((item) => {
            const key = `${item.productId}::${item.variantId}`;
            const row = selections[key];
            return (
              <div
                key={key}
                className="rounded-sm border border-stone px-4 py-3"
              >
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={() => toggle(key)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {item.snapshot.productName}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {item.snapshot.variantSize} · ordered {item.quantity}
                    </p>
                  </div>
                </label>
                {row.checked && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px]">Quantity</Label>
                      <Input
                        type="number"
                        min={1}
                        max={item.quantity}
                        value={row.quantity}
                        onChange={(e) =>
                          setSelections((prev) => ({
                            ...prev,
                            [key]: {
                              ...prev[key],
                              quantity: Math.min(
                                item.quantity,
                                Math.max(1, Number(e.target.value) || 1)
                              ),
                            },
                          }))
                        }
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px]">Reason</Label>
                      <select
                        value={row.reason}
                        onChange={(e) =>
                          setSelections((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], reason: e.target.value },
                          }))
                        }
                        className="mt-1 h-9 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none"
                      >
                        {REASONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div>
          <Label htmlFor="message">Additional details</Label>
          <Textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1.5"
          />
        </div>

        {error && <p className="text-sm text-terracotta">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="flex h-10 items-center rounded-sm bg-olive px-5 text-[11px] font-medium uppercase tracking-[0.15em] text-cream disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Submit request"
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
