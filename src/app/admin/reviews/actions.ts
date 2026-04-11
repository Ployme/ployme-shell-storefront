"use server";

import { revalidatePath } from "next/cache";
import { updateReview, type ReviewStatus } from "@/lib/store/reviews-store";

export async function setReviewStatus(id: string, status: ReviewStatus) {
  const result = await updateReview(id, { status });
  revalidatePath("/admin/reviews");
  revalidatePath("/product", "layout");
  return result ? { ok: true } : { ok: false };
}
