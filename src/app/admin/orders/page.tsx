import { getAllOrders } from "@/lib/store/order-store";
import { formatPrice } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { OrderStatusSelect } from "./order-status-select";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-stone/60 text-ink",
  confirmed: "bg-olive/15 text-olive",
  shipped: "bg-terracotta/15 text-terracotta",
  delivered: "bg-olive/25 text-olive-dark",
  cancelled: "bg-stone/40 text-muted-foreground",
};

export default async function OrderListPage() {
  const orders = await getAllOrders();

  // Sort newest first
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[32px] italic tracking-tight text-foreground">
          Orders
        </h1>
        <span className="text-sm text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-3 font-medium">Order</th>
              <th className="pb-3 pr-3 font-medium">Date</th>
              <th className="hidden pb-3 pr-3 font-medium sm:table-cell">
                Items
              </th>
              <th className="pb-3 pr-3 font-medium">Total</th>
              <th className="pb-3 pr-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Update</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((order) => {
              const itemSummary = order.items
                .map((item) => {
                  const name = item.snapshot?.productName ?? item.productId;
                  return `${name} ×${item.quantity}`;
                })
                .join(", ");

              const date = new Date(order.createdAt);
              const dateStr = date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <tr
                  key={order.id}
                  className="border-b border-stone/60 transition-colors hover:bg-muted/30"
                >
                  <td className="py-3 pr-3">
                    <span className="font-medium text-foreground">
                      {order.id}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">
                    {dateStr}
                  </td>
                  <td className="hidden max-w-[260px] truncate py-3 pr-3 text-muted-foreground sm:table-cell">
                    {itemSummary}
                  </td>
                  <td className="py-3 pr-3 tabular-nums text-foreground">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 pr-3">
                    <Badge
                      className={`rounded-sm text-[10px] ${STATUS_COLORS[order.status] ?? ""}`}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No orders yet.
          </p>
        )}
      </div>
    </div>
  );
}
