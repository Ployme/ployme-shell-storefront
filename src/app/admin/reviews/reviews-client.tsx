"use client";

import { useState, useTransition, useMemo } from "react";
import { Star } from "lucide-react";
import type { Review, ReviewStatus } from "@/lib/store/reviews-store";
import { Button } from "@/components/ui/button";
import { setReviewStatus } from "./actions";

const TABS: { key: ReviewStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export function ReviewsClient({
  initialReviews,
  productNames,
}: {
  initialReviews: Review[];
  productNames: Record<string, string>;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState<ReviewStatus>("pending");
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return reviews
      .filter((r) => r.status === tab)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [reviews, tab]);

  async function changeStatus(id: string, status: ReviewStatus) {
    startTransition(async () => {
      const result = await setReviewStatus(id, status);
      if (result.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
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
              {reviews.filter((r) => r.status === t.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-sm border border-stone p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {productNames[r.productId] ?? r.productId}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${
                        i < r.rating
                          ? "fill-terracotta text-terracotta"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[12px] text-muted-foreground">
                {new Date(r.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>

            <p className="mt-3 text-sm font-medium text-foreground">
              {r.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
            <p className="mt-3 text-[12px] text-muted-foreground">
              {r.customerName} · {r.customerEmail}
              {r.verifiedPurchase && " · Verified purchase"}
            </p>

            <div className="mt-4 flex gap-2">
              {r.status === "pending" && (
                <>
                  <Button onClick={() => changeStatus(r.id, "approved")}>
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => changeStatus(r.id, "rejected")}
                  >
                    Reject
                  </Button>
                </>
              )}
              {r.status === "approved" && (
                <Button
                  variant="outline"
                  onClick={() => changeStatus(r.id, "pending")}
                >
                  Un-approve
                </Button>
              )}
              {r.status === "rejected" && (
                <Button
                  variant="outline"
                  onClick={() => changeStatus(r.id, "pending")}
                >
                  Move to pending
                </Button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No reviews in this tab.
          </p>
        )}
      </div>
    </div>
  );
}
