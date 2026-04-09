import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/store/product-store";
import { COLLECTIONS } from "@/lib/data/collections";
import { ProductCard } from "@/components/shop/product-card";

export const metadata: Metadata = {
  title: "Oliveto — Hand-poured olive oil from small producers",
  description:
    "We import small-batch extra virgin olive oil from producers we visit, taste, and trust. Eighteen oils across three collections, chosen because they belong on a good table.",
};

const COLLECTION_GRADIENTS = [
  { bg: "from-olive to-olive-dark", text: "text-cream" },
  { bg: "from-terracotta to-terracotta/70", text: "text-cream" },
  { bg: "from-stone-dark to-ink/80", text: "text-cream" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* ── Section 1: Hero ──────────────────────────────────── */}
      <section className="flex min-h-[80vh] items-center">
        <div className="mx-auto max-w-6xl px-6 py-32 lg:py-40">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-terracotta">
            Hand-poured olive oil, sourced carefully
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-[52px] italic leading-[0.95] tracking-tight text-foreground sm:text-[80px] lg:text-[110px]">
            Oils with origin.
            <br />
            And with opinions.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            We import small-batch extra virgin olive oil from producers we
            visit, taste, and trust. Eighteen oils across three collections,
            chosen because they belong on a good table, not because they scored
            well in a magazine.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-sm bg-olive px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-cream transition-transform duration-100 active:scale-[0.97]"
            >
              Shop all oils
            </Link>
            <Link
              href="#"
              className="inline-flex h-12 items-center justify-center rounded-sm border border-olive/40 px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-olive transition-colors hover:border-olive"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 2: Featured products ─────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-24 lg:pt-32">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
              This week&rsquo;s table
            </p>
            <h2 className="mt-2 font-display text-[32px] italic leading-tight text-foreground lg:text-[40px]">
              What we&rsquo;re pouring
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="mt-3 h-px bg-stone" />
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => {
            const collection = COLLECTIONS.find(
              (c) => c.id === product.collectionId
            );
            return (
              <ProductCard
                key={product.id}
                product={product}
                collectionName={collection?.name}
              />
            );
          })}
        </div>
      </section>

      {/* ── Section 3: Collection teasers ────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-24 lg:pt-32">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {COLLECTIONS.map((collection, i) => {
            const gradient = COLLECTION_GRADIENTS[i];
            return (
              <Link
                key={collection.id}
                href={`/shop/${collection.id}`}
                className="group relative block overflow-hidden rounded-sm"
              >
                <div
                  className={`flex aspect-[3/4] flex-col justify-between bg-gradient-to-br p-8 transition-transform duration-300 group-hover:scale-[0.98] ${gradient.bg}`}
                >
                  <span
                    className={`text-[10px] font-medium uppercase tracking-[0.2em] opacity-60 ${gradient.text}`}
                  >
                    Collection
                  </span>
                  <div>
                    <h3
                      className={`font-display text-[36px] italic leading-[1.05] lg:text-[44px] ${gradient.text}`}
                    >
                      {collection.name}
                    </h3>
                    <p
                      className={`mt-2 line-clamp-2 text-[13px] leading-relaxed opacity-70 ${gradient.text}`}
                    >
                      {collection.description}
                    </p>
                    <span
                      className={`mt-4 inline-flex items-center gap-1 text-[12px] font-medium uppercase tracking-[0.12em] opacity-80 ${gradient.text}`}
                    >
                      Explore
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Section 4: Our approach ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-24 lg:pt-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {[
            {
              numeral: "I.",
              heading: "We taste first",
              body: "Every oil in the range was poured, sniffed, argued over, and tasted across three meals before we agreed to carry it. If it doesn't work on bread at breakfast, fish at lunch, and salad at dinner, it doesn't make the cut.",
            },
            {
              numeral: "II.",
              heading: "Small producers only",
              body: "We buy from farms and cooperatives, not brokers. Most of our producers make fewer than 10,000 litres a year. We know their names, their groves, and when they harvest. That's not marketing — it's how you get oil this good.",
            },
            {
              numeral: "III.",
              heading: "Fair to the farmer",
              body: "We pay above market rate and commit to volumes before harvest, so producers can plan without guessing. Good oil costs what it costs. We'd rather carry fewer oils at the right price than fill the shelf with compromises.",
            },
          ].map((item) => (
            <div key={item.numeral}>
              <span className="font-display text-2xl italic text-terracotta">
                {item.numeral}
              </span>
              <h3 className="mt-3 font-display text-[22px] italic leading-tight text-foreground">
                {item.heading}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: Footer CTA ────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="mx-auto max-w-lg font-display text-[36px] italic leading-[1.1] text-foreground lg:text-[48px]">
            Start with a bottle you&rsquo;ll come back to
          </h2>
          <Link
            href="/shop"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-sm bg-olive px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-cream transition-transform duration-100 active:scale-[0.97]"
          >
            Browse the collection
          </Link>
        </div>
      </section>
    </>
  );
}
