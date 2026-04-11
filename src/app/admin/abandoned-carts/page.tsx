import { getAllAbandonments } from "@/lib/store/abandoned-carts-store";
import { AbandonmentsClient } from "./abandonments-client";

export default async function AdminAbandonedCartsPage() {
  const rows = (await getAllAbandonments())
    .slice()
    .sort(
      (a, b) =>
        new Date(b.abandonedAt).getTime() - new Date(a.abandonedAt).getTime()
    );

  return (
    <div>
      <h1 className="font-display text-[32px] italic tracking-tight text-foreground">
        Abandoned carts
      </h1>
      <AbandonmentsClient initialRows={rows} />
    </div>
  );
}
