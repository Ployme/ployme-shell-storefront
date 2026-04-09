import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductsByCollection } from "@/lib/store/product-store";
import { COLLECTIONS } from "@/lib/data/collections";
import { ProductCard } from "@/components/shop/product-card";

type Props = {
  params: Promise<{ collection: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = COLLECTIONS.find((c) => c.id === slug);

  if (!collection) {
    return { title: "Collection not found — Oliveto" };
  }

  return {
    title: `${collection.name} — Oliveto`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { collection: slug } = await params;
  const collection = COLLECTIONS.find((c) => c.id === slug);

  if (!collection) {
    notFound();
  }

  const products = await getProductsByCollection(collection.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      {/* Back link */}
      <Link
        href="/shop"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All collections
      </Link>

      {/* Header */}
      <div className="mb-16 lg:mb-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
          Collection
        </p>
        <h1 className="mt-3 font-display text-[48px] italic leading-[1.05] tracking-tight text-foreground lg:text-[60px]">
          {collection.name}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {collection.description}
        </p>
      </div>

      <div className="h-px bg-stone" />

      {/* Product grid */}
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            collectionName={collection.name}
          />
        ))}
      </div>
    </div>
  );
}
