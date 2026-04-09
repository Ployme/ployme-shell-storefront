import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductsByCollection } from "@/lib/store/product-store";
import { COLLECTIONS } from "@/lib/data/collections";
import { ProductCard } from "@/components/shop/product-card";

export const metadata: Metadata = {
  title: "Shop — Oliveto",
  description:
    "Eighteen oils across three collections, sourced from small producers across Italy, Greece, Spain, and Portugal.",
};

export default async function ShopPage() {
  const collectionProducts = await Promise.all(
    COLLECTIONS.map(async (collection) => ({
      collection,
      products: await getProductsByCollection(collection.id),
    }))
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      {/* Intro */}
      <div className="mb-16 lg:mb-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
          The full range
        </p>
        <h1 className="mt-3 font-display text-[48px] italic leading-[1.05] tracking-tight text-foreground lg:text-[60px]">
          Every oil we carry
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Eighteen oils across three collections, sourced from small producers
          across Italy, Greece, Spain, and Portugal. We taste everything we sell
          and only carry what we&rsquo;d put on our own table.
        </p>
      </div>

      {/* Collection sections */}
      <div className="space-y-20 lg:space-y-24">
        {collectionProducts.map(({ collection, products }) => (
          <section key={collection.id}>
            {/* Collection header */}
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[32px] italic leading-tight text-foreground lg:text-[40px]">
                {collection.name}
              </h2>
              <Link
                href={`/shop/${collection.id}`}
                className="flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="mt-3 h-px bg-stone" />

            {/* Product grid */}
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  collectionName={collection.name}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
