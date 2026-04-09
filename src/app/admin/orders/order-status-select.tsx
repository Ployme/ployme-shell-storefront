"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { OrderStatus } from "@/lib/types";
import { adminUpdateOrderStatus } from "../actions";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as OrderStatus;
    await adminUpdateOrderStatus(orderId, status);
    toast(`Order ${orderId} → ${status}`);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="h-7 rounded-sm border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
