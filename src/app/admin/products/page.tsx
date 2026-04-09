import Link from "next/link";
import { getAllProducts } from "@/lib/store/product-store";
import { COLLECTIONS } from "@/lib/data/collections";
import { formatPrice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductListClient } from "./product-list-client";

export default async function ProductListPage() {
  const products = await getAllProducts();

  const enriched = products.map((product) => {
    const collection = COLLECTIONS.find((c) => c.id === product.collectionId);
    const prices = product.variants.map((v) => v.price);
    const totalStock = product.variants.reduce((s, v) => s + v.inventory, 0);
    return {
      product,
      collectionName: collection?.name ?? "—",
      priceRange:
        prices.length === 1
          ? formatPrice(prices[0])
          : `${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}`,
      totalStock,
      variantCount: product.variants.length,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[32px] italic tracking-tight text-foreground">
          Products
        </h1>
        <Link href="/admin/products/new">
          <Button size="default">
            <Plus className="size-4" data-icon="inline-start" />
            Add product
          </Button>
        </Link>
      </div>

      <ProductListClient products={enriched} />
    </div>
  );
}
