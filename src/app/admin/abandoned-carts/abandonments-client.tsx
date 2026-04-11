"use client";

import { useState, useTransition } from "react";
import type { CartAbandonment } from "@/lib/store/abandoned-carts-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/types";
import {
  adminRunAbandonmentCheck,
  adminSendAbandonmentReminder,
} from "./actions";

function describeStatus(row: CartAbandonment): {
  label: string;
  className: string;
} {
  if (row.recovered) return { label: "Recovered", className: "bg-olive/15 text-olive" };
  if (row.reminderSentAt)
    return {
      label: "Reminder sent",
      className: "bg-terracotta/15 text-terracotta",
    };
  return { label: "Pending reminder", className: "bg-stone/40 text-muted-foreground" };
}

export function AbandonmentsClient({
  initialRows,
}: {
  initialRows: CartAbandonment[];
}) {
  const [rows, setRows] = useState(initialRows);
  const [message, setMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const total = rows.length;
  const sent = rows.filter((r) => r.reminderSentAt).length;
  const recovered = rows.filter((r) => r.recovered).length;

  function runCheck() {
    startTransition(async () => {
      const result = await adminRunAbandonmentCheck();
      setMessage(`Sent ${result.sent} reminder${result.sent === 1 ? "" : "s"}`);
      setRows((prev) =>
        prev.map((r) =>
          r.reminderSentAt || r.recovered
            ? r
            : { ...r, reminderSentAt: new Date().toISOString() }
        )
      );
    });
  }

  function sendOne(id: string) {
    startTransition(async () => {
      const result = await adminSendAbandonmentReminder(id);
      if (result.ok) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, reminderSentAt: new Date().toISOString() }
              : r
          )
        );
      }
    });
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex gap-6">
          <Stat label="Total" value={total} />
          <Stat label="Reminders sent" value={sent} />
          <Stat label="Recovered" value={recovered} />
          <Stat
            label="Recovery rate"
            value={total === 0 ? "0%" : `${Math.round((recovered / total) * 100)}%`}
          />
        </div>
        <Button onClick={runCheck}>Run abandonment check</Button>
      </div>
      {message && (
        <p className="mt-3 text-sm text-olive">{message}</p>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-3">Email</th>
              <th className="pb-3 pr-3">Items</th>
              <th className="pb-3 pr-3">Subtotal</th>
              <th className="pb-3 pr-3">Abandoned</th>
              <th className="pb-3 pr-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = describeStatus(row);
              return (
                <tr key={row.id} className="border-b border-stone/60">
                  <td className="py-3 pr-3 text-foreground">
                    {row.customerEmail}
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">
                    {row.items.reduce((s, i) => s + i.quantity, 0)} items
                  </td>
                  <td className="py-3 pr-3 tabular-nums text-foreground">
                    {formatPrice(row.subtotal)}
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">
                    {new Date(row.abandonedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`rounded-sm px-2 py-1 text-[10px] font-medium uppercase ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3">
                    {!row.recovered && !row.reminderSentAt && (
                      <Button
                        variant="outline"
                        onClick={() => sendOne(row.id)}
                      >
                        Send reminder
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No abandoned carts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl italic text-foreground">
        {value}
      </p>
    </div>
  );
}
