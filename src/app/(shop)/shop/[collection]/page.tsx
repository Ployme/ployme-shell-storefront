import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProductsByCollection } from "@/lib/store/product-store";
import { COLLECTIONS } from "@/lib/data/collections";
import { CollectionGrid } from "./collection-grid";

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
  const otherCollections = COLLECTIONS.filter((c) => c.id !== collection.id);

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
        <h1 className="mt-3 font-display text-[56px] italic leading-[1.05] tracking-tight text-foreground lg:text-[72px]">
          {collection.name}
        </h1>
        <p className="mt-6 max-w-2xl font-display text-lg leading-relaxed text-foreground/80 lg:text-xl">
          {collection.description}
        </p>
        <div className="mt-10 h-px bg-olive/20" />
      </div>

      {/* Sortable grid */}
      <CollectionGrid products={products} collectionName={collection.name} />

      {/* Continue exploring */}
      <section className="mt-24 lg:mt-32">
        <h2 className="font-display text-2xl italic text-foreground">
          Continue exploring
        </h2>
        <div className="mt-6 h-px bg-stone" />
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {otherCollections.map((other) => (
            <Link
              key={other.id}
              href={`/shop/${other.id}`}
              className="group flex items-start justify-between py-2"
            >
              <div>
                <h3 className="font-display text-[28px] italic leading-tight text-foreground transition-colors group-hover:text-olive">
                  {other.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {other.description}
                </p>
              </div>
              <ArrowRight className="mt-2 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
