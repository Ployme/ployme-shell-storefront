import { getAllReturns } from "@/lib/store/returns-store";
import { ReturnsClient } from "./returns-client";

export default async function AdminReturnsPage() {
  const returns = (await getAllReturns()).slice().sort(
    (a, b) =>
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );

  return (
    <div>
      <h1 className="font-display text-[32px] italic tracking-tight text-foreground">
        Returns
      </h1>
      <ReturnsClient initialReturns={returns} />
    </div>
  );
}
