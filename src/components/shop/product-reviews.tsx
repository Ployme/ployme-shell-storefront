import { Star } from "lucide-react";
import { getReviewsForProduct } from "@/lib/store/reviews-store";
import { WriteReviewForm } from "./write-review-form";

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating
              ? "fill-terracotta text-terracotta"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export async function ProductReviews({
  productId,
  currentCustomer,
}: {
  productId: string;
  currentCustomer: { name: string; email: string } | null;
}) {
  const approved = await getReviewsForProduct(productId, "approved");

  const average =
    approved.length === 0
      ? 0
      : approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;

  return (
    <section className="mt-20 border-t border-stone pt-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl italic text-foreground">
            Reviews
          </h2>
          {approved.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {average.toFixed(1)}
              </span>{" "}
              out of 5, based on {approved.length} review
              {approved.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <WriteReviewForm productId={productId} currentCustomer={currentCustomer} />
      </div>

      {approved.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          No reviews yet. Be the first.
        </p>
      ) : (
        <ul className="mt-10 space-y-8">
          {approved
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 10)
            .map((review) => (
              <li
                key={review.id}
                className="border-b border-stone/60 pb-8 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {renderStars(review.rating)}
                  <p className="text-sm font-medium text-foreground">
                    {review.title}
                  </p>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {review.body}
                </p>
                <div className="mt-3 flex items-center gap-3 text-[12px] text-muted-foreground">
                  <span>{review.customerName}</span>
                  <span>·</span>
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {review.verifiedPurchase && (
                    <>
                      <span>·</span>
                      <span className="rounded-sm bg-olive/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-olive">
                        Verified purchase
                      </span>
                    </>
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
