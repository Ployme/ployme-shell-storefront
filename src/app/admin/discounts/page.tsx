import { integrations } from "@/lib/integrations";
import { DiscountsClient } from "./discounts-client";

export default async function AdminDiscountsPage() {
  const discounts = await integrations.discounts.list();

  return (
    <div>
      <h1 className="font-display text-[32px] italic tracking-tight text-foreground">
        Discounts
      </h1>
      <div className="mt-6">
        <DiscountsClient initialDiscounts={discounts} />
      </div>
    </div>
  );
}
