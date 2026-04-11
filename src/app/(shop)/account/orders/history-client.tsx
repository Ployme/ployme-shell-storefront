"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

type OrderRow = {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  totalDisplay: string;
  itemSummary: string;
};

const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

export function OrderHistoryClient({ orders }: { orders: OrderRow[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (!q) return true;
      const needle = q.toLowerCase();
      return (
        o.id.toLowerCase().includes(needle) ||
        o.itemSummary.toLowerCase().includes(needle)
      );
    });
  }, [orders, q, status]);

  if (orders.length === 0) return null;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by order id or product"
          className="h-10 sm:max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <ul className="mt-5 divide-y divide-stone rounded-sm border border-stone">
        {filtered.map((o) => (
          <li key={o.id} className="px-5 py-4">
            <Link
              href={`/account/orders/${o.id}`}
              className="flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{o.id}</p>
                <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                  {o.itemSummary}
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {o.status}
                </p>
              </div>
              <span className="shrink-0 tabular-nums text-sm text-foreground">
                {o.totalDisplay}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No orders match your filter.
        </p>
      )}
    </div>
  );
}
