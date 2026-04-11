"use client";

import { useState, useTransition } from "react";
import type { ReturnRequest, ReturnStatus } from "@/lib/store/returns-store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/types";
import {
  adminApproveReturn,
  adminRejectReturn,
  adminMarkReturnReceived,
  adminProcessRefund,
} from "./actions";

const TABS: { key: ReturnStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "received", label: "Received" },
  { key: "refunded", label: "Refunded" },
  { key: "rejected", label: "Rejected" },
];

export function ReturnsClient({
  initialReturns,
}: {
  initialReturns: ReturnRequest[];
}) {
  const [returns, setReturns] = useState(initialReturns);
  const [tab, setTab] = useState<ReturnStatus | "all">("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [, startTransition] = useTransition();

  const filtered = returns.filter((r) => tab === "all" || r.status === tab);

  function applyUpdate(updated: ReturnRequest | undefined) {
    if (!updated) return;
    setReturns((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  }

  function approve(id: string) {
    startTransition(async () => {
      const result = await adminApproveReturn(id);
      if (result.ok) applyUpdate(result.return);
    });
  }

  function reject(id: string) {
    if (!rejectNotes.trim()) return;
    startTransition(async () => {
      const result = await adminRejectReturn(id, rejectNotes.trim());
      if (result.ok) {
        applyUpdate(result.return);
        setRejectingId(null);
        setRejectNotes("");
      }
    });
  }

  function markReceived(id: string) {
    startTransition(async () => {
      const result = await adminMarkReturnReceived(id);
      if (result.ok) applyUpdate(result.return);
    });
  }

  function processRefund(id: string) {
    startTransition(async () => {
      const result = await adminProcessRefund(id);
      if (result.ok) applyUpdate(result.return);
    });
  }

  return (
    <div>
      <div className="mt-6 flex gap-2 border-b border-stone">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm transition-colors ${
              tab === t.key
                ? "border-olive text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-[11px] text-muted-foreground">
              {
                returns.filter(
                  (r) => t.key === "all" || r.status === t.key
                ).length
              }
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="rounded-sm border border-stone p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg italic text-foreground">
                  {r.id} · {r.orderId}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {r.customerEmail}
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Requested{" "}
                  {new Date(r.requestedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`rounded-sm px-2 py-1 text-[10px] font-medium uppercase ${
                  r.status === "refunded"
                    ? "bg-olive/15 text-olive"
                    : r.status === "rejected"
                      ? "bg-terracotta/15 text-terracotta"
                      : "bg-stone/40 text-muted-foreground"
                }`}
              >
                {r.status}
              </span>
            </div>

            <ul className="mt-4 space-y-1.5 text-sm">
              {r.items.map((item, i) => (
                <li key={i} className="text-foreground">
                  {item.quantity} × {item.productId}{" "}
                  <span className="text-muted-foreground">
                    ({item.variantId}) — {item.reason}
                  </span>
                </li>
              ))}
            </ul>

            {r.customerMessage && (
              <p className="mt-3 rounded-sm bg-muted/40 p-3 text-sm text-muted-foreground">
                {r.customerMessage}
              </p>
            )}

            {r.refundAmount !== undefined && (
              <p className="mt-3 text-sm text-foreground">
                Refund: {formatPrice(r.refundAmount)}
              </p>
            )}
            {r.adminNotes && (
              <p className="mt-3 text-sm text-muted-foreground">
                Notes: {r.adminNotes}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {r.status === "pending" && (
                <>
                  <Button onClick={() => approve(r.id)}>Approve</Button>
                  <Button
                    variant="outline"
                    onClick={() => setRejectingId(r.id)}
                  >
                    Reject
                  </Button>
                </>
              )}
              {r.status === "approved" && (
                <Button onClick={() => markReceived(r.id)}>
                  Mark received
                </Button>
              )}
              {r.status === "received" && (
                <Button onClick={() => processRefund(r.id)}>
                  Process refund
                </Button>
              )}
            </div>

            {rejectingId === r.id && (
              <div className="mt-4 rounded-sm border border-stone p-4">
                <p className="text-sm font-medium">Reason for rejection</p>
                <Textarea
                  rows={3}
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  className="mt-2"
                />
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => reject(r.id)}
                    disabled={!rejectNotes.trim()}
                  >
                    Send rejection
                  </Button>
                  <button
                    onClick={() => {
                      setRejectingId(null);
                      setRejectNotes("");
                    }}
                    className="text-sm text-muted-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No returns in this tab.
          </p>
        )}
      </div>
    </div>
  );
}
