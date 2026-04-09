import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug, getProductsByCollection } from "@/lib/store/product-store";
import { COLLECTIONS } from "@/lib/data/collections";
import { ProductDetail } from "./product-detail";
import { ProductCard } from "@/components/shop/product-card";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found — Oliveto" };
  }

  return {
    title: `${product.name} — Oliveto`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const collection = COLLECTIONS.find((c) => c.id === product.collectionId);
  const collectionName = collection?.name ?? "";

  const siblings = (await getProductsByCollection(product.collectionId))
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      {/* Back link */}
      <Link
        href={`/shop/${product.collectionId}`}
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to {collectionName}
      </Link>

      <ProductDetail product={product} collectionName={collectionName} />

      {/* You might also like */}
      {siblings.length > 0 && (
        <section className="mt-24 lg:mt-32">
          <h2 className="font-display text-2xl italic text-foreground">
            You might also like
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {siblings.map((sibling) => (
              <ProductCard key={sibling.id} product={sibling} collectionName={collectionName} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
