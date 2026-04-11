import "server-only";

import { kvRead, kvWrite, nsKey } from "@/lib/store/kv";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  productId: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  body: string;
  status: ReviewStatus;
  createdAt: string;
  verifiedPurchase: boolean;
};

const KEY = nsKey("reviews", "all");

async function readAll(): Promise<Review[]> {
  return (await kvRead<Review[]>(KEY)) ?? [];
}

async function writeAll(rows: Review[]): Promise<void> {
  await kvWrite(KEY, rows);
}

export async function getAllReviews(): Promise<Review[]> {
  return readAll();
}

export async function getReviewsForProduct(
  productId: string,
  status?: ReviewStatus
): Promise<Review[]> {
  const all = await readAll();
  return all.filter(
    (r) => r.productId === productId && (!status || r.status === status)
  );
}

export async function createReview(
  review: Omit<Review, "id" | "createdAt" | "status">
): Promise<Review> {
  const all = await readAll();
  const record: Review = {
    id: `rev_${Math.random().toString(36).slice(2, 12)}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    ...review,
  };
  all.push(record);
  await writeAll(all);
  return record;
}

export async function updateReview(
  id: string,
  patch: Partial<Review>
): Promise<Review | undefined> {
  const all = await readAll();
  const i = all.findIndex((r) => r.id === id);
  if (i === -1) return undefined;
  all[i] = { ...all[i], ...patch };
  await writeAll(all);
  return all[i];
}
