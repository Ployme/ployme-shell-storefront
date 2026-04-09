"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-olive/30 to-stone/60",
  "from-terracotta/20 to-cream",
  "from-stone-dark/30 to-olive/20",
  "from-olive-dark/25 to-stone/50",
  "from-terracotta/15 to-stone-dark/30",
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function ProductImage({
  src,
  alt,
  productName,
  className,
}: {
  src: string;
  alt: string;
  productName: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (error || !src) {
    const gradient = GRADIENTS[hashName(productName) % GRADIENTS.length];
    return (
      <div
        className={cn(
          "relative flex items-end bg-gradient-to-br",
          gradient,
          className
        )}
      >
        <span className="p-6 font-display text-xl italic text-ink/70">
          {productName}
        </span>
      </div>
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
