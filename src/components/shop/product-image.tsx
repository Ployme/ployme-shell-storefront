"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const GRADIENT_PALETTES = [
  { bg: "from-olive to-olive-dark", text: "text-cream" },
  { bg: "from-terracotta to-terracotta/80", text: "text-cream" },
  { bg: "from-stone to-ink/90", text: "text-cream" },
  { bg: "from-cream to-stone", text: "text-ink" },
  { bg: "from-olive to-terracotta/70", text: "text-cream" },
  { bg: "from-olive-dark to-cream/90", text: "text-ink" },
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function Fallback({
  productName,
  collectionName,
  className,
  palette,
}: {
  productName: string;
  collectionName?: string;
  className?: string;
  palette: (typeof GRADIENT_PALETTES)[number];
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between bg-gradient-to-br",
        palette.bg,
        className
      )}
    >
      {collectionName && (
        <span
          className={cn(
            "p-5 text-[10px] font-medium uppercase tracking-[0.2em] opacity-60",
            palette.text
          )}
        >
          {collectionName}
        </span>
      )}
      <span
        className={cn(
          "p-6 font-display text-2xl italic leading-tight lg:text-3xl",
          palette.text
        )}
      >
        {productName}
      </span>
    </div>
  );
}

export function ProductImage({
  src,
  alt,
  productName,
  collectionName,
  forceFallback,
  className,
}: {
  src: string;
  alt: string;
  productName: string;
  collectionName?: string;
  forceFallback?: boolean;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const palette = GRADIENT_PALETTES[hashName(productName) % GRADIENT_PALETTES.length];

  if (forceFallback || error || !src) {
    return (
      <Fallback
        productName={productName}
        collectionName={collectionName}
        className={className}
        palette={palette}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => setError(true)}
    />
  );
}
