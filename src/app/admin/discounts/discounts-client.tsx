"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Discount } from "@/lib/integrations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/types";
import {
  adminCreateDiscount,
  adminUpdateDiscount,
  adminDeleteDiscount,
  adminListDiscounts,
} from "./actions";

function emptyDiscount(): Discount {
  return {
    id: `dsc_${Math.random().toString(36).slice(2, 10)}`,
    code: "",
    type: "percentage",
    value: 10,
    usageCount: 0,
    active: true,
  };
}

export function DiscountsClient({
  initialDiscounts,
}: {
  initialDiscounts: Discount[];
}) {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [, startTransition] = useTransition();

  async function refresh() {
    const next = await adminListDiscounts();
    setDiscounts(next);
  }

  function startCreate() {
    setIsNew(true);
    setEditing(emptyDiscount());
  }

  function startEdit(d: Discount) {
    setIsNew(false);
    setEditing({ ...d });
  }

  async function saveEditing() {
    if (!editing) return;
    if (isNew) {
      await adminCreateDiscount(editing);
    } else {
      await adminUpdateDiscount(editing.id, editing);
    }
    setEditing(null);
    startTransition(refresh);
  }

  async function toggleActive(d: Discount) {
    await adminUpdateDiscount(d.id, { active: !d.active });
    startTransition(refresh);
  }

  async function remove(d: Discount) {
    if (!confirm(`Delete discount ${d.code}?`)) return;
    await adminDeleteDiscount(d.id);
    startTransition(refresh);
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={startCreate}>
          <Plus className="size-4" data-icon="inline-start" />
          New discount
        </Button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-3">Code</th>
              <th className="pb-3 pr-3">Type</th>
              <th className="pb-3 pr-3">Value</th>
              <th className="pb-3 pr-3">Min spend</th>
              <th className="pb-3 pr-3">Expiry</th>
              <th className="pb-3 pr-3">Used</th>
              <th className="pb-3 pr-3">Active</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-b border-stone/60">
                <td className="py-3 pr-3 font-medium text-foreground">
                  {d.code}
                </td>
                <td className="py-3 pr-3 text-muted-foreground">{d.type}</td>
                <td className="py-3 pr-3 text-foreground">
                  {d.type === "percentage"
                    ? `${d.value}%`
                    : formatPrice(d.value)}
                </td>
                <td className="py-3 pr-3 text-muted-foreground">
                  {d.minimumSpend ? formatPrice(d.minimumSpend) : "—"}
                </td>
                <td className="py-3 pr-3 text-muted-foreground">
                  {d.expiresAt
                    ? new Date(d.expiresAt).toLocaleDateString("en-GB")
                    : "—"}
                </td>
                <td className="py-3 pr-3 text-foreground">
                  {d.usageCount}
                  {d.usageLimit !== undefined ? ` / ${d.usageLimit}` : ""}
                </td>
                <td className="py-3 pr-3">
                  <button
                    onClick={() => toggleActive(d)}
                    className={`rounded-sm px-2 py-1 text-[10px] font-medium uppercase ${
                      d.active
                        ? "bg-olive/15 text-olive"
                        : "bg-stone/40 text-muted-foreground"
                    }`}
                  >
                    {d.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(d)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => remove(d)}
                      className="text-muted-foreground hover:text-terracotta"
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No discounts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
        >
          <div className="w-full max-w-lg rounded-sm border border-stone bg-background p-6">
            <p className="font-display text-2xl italic text-foreground">
              {isNew ? "New discount" : `Edit ${editing.code}`}
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <Label>Code</Label>
                <Input
                  value={editing.code}
                  onChange={(e) =>
                    setEditing({ ...editing, code: e.target.value.toUpperCase() })
                  }
                  className="mt-1.5 h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <select
                    value={editing.type}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed (pence)</option>
                  </select>
                </div>
                <div>
                  <Label>Value</Label>
                  <Input
                    type="number"
                    value={editing.value}
                    onChange={(e) =>
                      setEditing({ ...editing, value: Number(e.target.value) })
                    }
                    className="mt-1.5 h-10"
                  />
                </div>
              </div>
              <div>
                <Label>Minimum spend (pence)</Label>
                <Input
                  type="number"
                  value={editing.minimumSpend ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      minimumSpend: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="mt-1.5 h-10"
                />
              </div>
              <div>
                <Label>Expires at (ISO date or blank)</Label>
                <Input
                  type="date"
                  value={
                    editing.expiresAt ? editing.expiresAt.slice(0, 10) : ""
                  }
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      expiresAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    })
                  }
                  className="mt-1.5 h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total usage limit</Label>
                  <Input
                    type="number"
                    value={editing.usageLimit ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        usageLimit: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="mt-1.5 h-10"
                  />
                </div>
                <div>
                  <Label>Per-customer limit</Label>
                  <Input
                    type="number"
                    value={editing.usageLimitPerCustomer ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        usageLimitPerCustomer: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="mt-1.5 h-10"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) =>
                    setEditing({ ...editing, active: e.target.checked })
                  }
                />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="text-sm text-muted-foreground"
              >
                Cancel
              </button>
              <Button onClick={saveEditing}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
