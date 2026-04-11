"use client";

import { useState, useMemo } from "react";
import type { StockAlert } from "@/lib/store/stock-alerts-store";

export function StockAlertsClient({
  alerts,
  productNames,
}: {
  alerts: StockAlert[];
  productNames: Record<string, string>;
}) {
  const [productFilter, setProductFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "waiting" | "notified">("all");

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (productFilter !== "all" && a.productId !== productFilter) return false;
      if (statusFilter === "waiting" && a.notified) return false;
      if (statusFilter === "notified" && !a.notified) return false;
      return true;
    });
  }, [alerts, productFilter, statusFilter]);

  const waiting = alerts.filter((a) => !a.notified).length;
  const notified = alerts.length - waiting;

  const productIds = Array.from(new Set(alerts.map((a) => a.productId)));

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Waiting
          </p>
          <p className="mt-1 font-display text-2xl italic text-foreground">
            {waiting}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Notified
          </p>
          <p className="mt-1 font-display text-2xl italic text-foreground">
            {notified}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm"
        >
          <option value="all">All products</option>
          {productIds.map((id) => (
            <option key={id} value={id}>
              {productNames[id] ?? id}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "waiting" | "notified")}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="waiting">Waiting</option>
          <option value="notified">Notified</option>
        </select>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-3">Email</th>
              <th className="pb-3 pr-3">Product</th>
              <th className="pb-3 pr-3">Variant</th>
              <th className="pb-3 pr-3">Status</th>
              <th className="pb-3 pr-3">Created</th>
              <th className="pb-3">Notified</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-stone/60">
                <td className="py-3 pr-3 text-foreground">{a.email}</td>
                <td className="py-3 pr-3 text-muted-foreground">
                  {productNames[a.productId] ?? a.productId}
                </td>
                <td className="py-3 pr-3 text-muted-foreground">
                  {a.variantId ?? "any"}
                </td>
                <td className="py-3 pr-3">
                  <span
                    className={`rounded-sm px-2 py-1 text-[10px] font-medium uppercase ${
                      a.notified
                        ? "bg-olive/15 text-olive"
                        : "bg-stone/40 text-muted-foreground"
                    }`}
                  >
                    {a.notified ? "Notified" : "Waiting"}
                  </span>
                </td>
                <td className="py-3 pr-3 text-muted-foreground">
                  {new Date(a.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="py-3 text-muted-foreground">
                  {a.notifiedAt
                    ? new Date(a.notifiedAt).toLocaleDateString("en-GB")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No alerts match.
          </p>
        )}
      </div>
    </div>
  );
}
