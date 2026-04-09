"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  // a) Deep olive
  "linear-gradient(135deg, #3D4A2A 0%, #2C3A1E 100%)",
  // b) Terracotta
  "linear-gradient(135deg, #B8472A 0%, #8A3420 100%)",
  // c) Ink-to-olive
  "linear-gradient(135deg, #1F1F1A 0%, #3D4A2A 100%)",
  // d) Stone-to-ink
  "linear-gradient(135deg, #A8A193 0%, #1F1F1A 100%)",
  // e) Olive-to-terracotta
  "linear-gradient(135deg, #3D4A2A 0%, #B8472A 100%)",
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = h + name.charCodeAt(i) * (i + 1);
  }
  return h;
}

function Fallback({
  productName,
  collectionName,
  className,
  gradient,
  size = "lg",
}: {
  productName: string;
  collectionName?: string;
  className?: string;
  gradient: string;
  size?: "lg" | "sm" | "xs";
}) {
  if (size === "xs") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center",
          className
        )}
        style={{ background: gradient }}
      >
        <span className="font-display text-lg italic text-cream/80">
          {productName.charAt(0)}
        </span>
      </div>
    );
  }

  if (size === "sm") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center",
          className
        )}
        style={{ background: gradient }}
      >
        <span className="font-display text-2xl italic text-cream/80">
          {productName.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex flex-col justify-between", className)}
      style={{ background: gradient }}
    >
      {collectionName && (
        <span className="p-5 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/60">
          {collectionName}
        </span>
      )}
      <span className="p-6 font-display text-2xl italic leading-tight text-cream lg:text-3xl">
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
  size = "lg",
}: {
  src: string;
  alt: string;
  productName: string;
  collectionName?: string;
  forceFallback?: boolean;
  className?: string;
  size?: "lg" | "sm" | "xs";
}) {
  const [error, setError] = useState(false);
  const gradient = GRADIENTS[hashName(productName) % GRADIENTS.length];

  if (forceFallback || error || !src) {
    return (
      <Fallback
        productName={productName}
        collectionName={collectionName}
        className={className}
        gradient={gradient}
        size={size}
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
