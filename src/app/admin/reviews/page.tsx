import { getAllReviews } from "@/lib/store/reviews-store";
import { getAllProducts } from "@/lib/store/product-store";
import { ReviewsClient } from "./reviews-client";

export default async function AdminReviewsPage() {
  const [reviews, products] = await Promise.all([
    getAllReviews(),
    getAllProducts(),
  ]);
  const productNames = Object.fromEntries(products.map((p) => [p.id, p.name]));

  return (
    <div>
      <h1 className="font-display text-[32px] italic tracking-tight text-foreground">
        Reviews
      </h1>
      <ReviewsClient initialReviews={reviews} productNames={productNames} />
    </div>
  );
}
