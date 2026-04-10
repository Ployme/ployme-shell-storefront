"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { useCart } from "@/lib/cart/cart-context";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/shop/product-image";

export function ProductDetail({
  product,
  collectionName,
}: {
  product: Product;
  collectionName: string;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id
  );
  const [quantity, setQuantity] = useState(1);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const { addItem } = useCart();

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  ) as ProductVariant;

  function handleAddToCart() {
    addItem(product, selectedVariant, quantity);
    toast("Added to cart");
  }

  const hasImages = product.images.length > 0;

  return (
    <div className="lg:grid lg:grid-cols-5 lg:gap-16">
      {/* Left column — image gallery */}
      <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
        <div className="overflow-hidden rounded-sm">
          {hasImages ? (
            <div className="relative aspect-[4/5] w-full">
              {product.images.map((img, i) => (
                <ProductImage
                  key={i}
                  src={img}
                  alt={`${product.name} — image ${i + 1}`}
                  productName={product.name}
                  collectionName={collectionName}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-200 ${
                    i === primaryImageIndex
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                />
              ))}
            </div>
          ) : (
            <ProductImage
              src=""
              alt={product.name}
              productName={product.name}
              collectionName={collectionName}
              forceFallback
              className="aspect-[4/5] w-full"
            />
          )}
        </div>

        {/* Thumbnails */}
        {hasImages && product.images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setPrimaryImageIndex(i)}
                className={`overflow-hidden rounded-sm ${
                  i === primaryImageIndex
                    ? "ring-2 ring-olive ring-offset-2 ring-offset-background"
                    : "opacity-70 hover:opacity-100"
                } transition-all`}
              >
                <ProductImage
                  src={img}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  productName={product.name}
                  collectionName={collectionName}
                  className="aspect-[4/5] w-20 lg:w-24"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right column — product info */}
      <div className="mt-10 lg:col-span-2 lg:mt-0">
        {/* Eyebrow */}
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
          {collectionName}
        </p>

        {/* Product name */}
        <h1 className="mt-3 font-display text-[44px] italic leading-[1.05] tracking-tight text-foreground lg:text-[52px]">
          {product.name}
        </h1>

        {/* Origin line */}
        <p className="mt-4 text-sm text-muted-foreground">
          {product.origin} · {product.producer} · {product.harvest} harvest
        </p>

        {/* Divider */}
        <div className="my-8 h-px bg-olive/20" />

        {/* Short description */}
        <p className="font-display text-lg leading-relaxed text-foreground lg:text-xl">
          {product.shortDescription}
        </p>

        {/* Full description */}
        <p className="mt-6 text-[15px] leading-[1.7] text-muted-foreground">
          {product.description}
        </p>

        {/* Tasting notes */}
        <div className="mt-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Tasting notes
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tastingNotes.map((note) => (
              <Badge
                key={note}
                variant="secondary"
                className="rounded-full bg-stone/50 px-3 py-1 text-xs font-normal text-olive"
              >
                {note}
              </Badge>
            ))}
          </div>
        </div>

        {/* Pairings */}
        <div className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Pairs with
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.pairings.map((pairing) => (
              <Badge
                key={pairing}
                variant="secondary"
                className="rounded-full bg-stone/50 px-3 py-1 text-xs font-normal text-olive"
              >
                {pairing}
              </Badge>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-stone" />

        {/* Size selector */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Size
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => {
                  setSelectedVariantId(variant.id);
                  setQuantity(1);
                }}
                className={`rounded-sm px-5 py-3 text-sm font-medium transition-colors ${
                  variant.id === selectedVariantId
                    ? "bg-olive text-cream"
                    : "border border-olive/40 bg-transparent text-foreground hover:border-olive"
                }`}
              >
                {variant.size} — {formatPrice(variant.price)}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Quantity
          </p>
          <div className="mt-3 inline-flex items-center border border-olive/30 rounded-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-stone/30 disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="flex h-10 w-12 items-center justify-center text-sm tabular-nums font-medium text-foreground">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(selectedVariant.inventory, q + 1)
                )
              }
              disabled={quantity >= selectedVariant.inventory}
              className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-stone/30 disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="mt-8 flex h-14 w-full max-w-[400px] items-center justify-center rounded-sm bg-olive text-[12px] font-medium uppercase tracking-[0.15em] text-cream transition-transform active:scale-[0.97] duration-100"
        >
          Add to cart — {formatPrice(selectedVariant.price * quantity)}
        </button>

        {/* Inventory hint */}
        {selectedVariant.inventory < 20 && (
          <p className="mt-3 text-xs text-muted-foreground">
            {selectedVariant.inventory} in stock
          </p>
        )}

        {/* Reassurance */}
        <p className="mt-4 text-[11px] text-muted-foreground">
          Ships from our Shoreditch store · Free UK shipping over £40
        </p>
      </div>
    </div>
  );
}
