import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { ProductImage } from "@/components/shop/product-image";

export function ProductCard({
  product,
  collectionName,
}: {
  product: Product;
  collectionName?: string;
}) {
  const startingPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-sm">
        <ProductImage
          src={product.images[0] ?? ""}
          alt={product.name}
          productName={product.name}
          collectionName={collectionName}
          forceFallback={product.images.length === 0}
          className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-display text-xl italic leading-tight text-foreground">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
        <p className="text-sm tabular-nums text-foreground">
          {product.variants.length > 1 ? "From " : ""}
          {formatPrice(startingPrice)}
        </p>
      </div>
    </Link>
  );
}
