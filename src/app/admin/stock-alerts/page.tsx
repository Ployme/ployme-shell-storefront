import { getAllStockAlerts } from "@/lib/store/stock-alerts-store";
import { getAllProducts } from "@/lib/store/product-store";
import { StockAlertsClient } from "./stock-alerts-client";

export default async function AdminStockAlertsPage() {
  const [alerts, products] = await Promise.all([
    getAllStockAlerts(),
    getAllProducts(),
  ]);
  const productNames = Object.fromEntries(
    products.map((p) => [p.id, p.name])
  );

  return (
    <div>
      <h1 className="font-display text-[32px] italic tracking-tight text-foreground">
        Stock alerts
      </h1>
      <StockAlertsClient
        alerts={alerts.slice().sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )}
        productNames={productNames}
      />
    </div>
  );
}
