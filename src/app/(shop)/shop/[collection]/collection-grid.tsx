"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/product-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-az";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  "name-az": "Name, A–Z",
};

function sortProducts(products: Product[], key: SortKey): Product[] {
  const sorted = [...products];
  switch (key) {
    case "featured":
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    case "price-asc":
      return sorted.sort(
        (a, b) => Math.min(...a.variants.map((v) => v.price)) - Math.min(...b.variants.map((v) => v.price))
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => Math.min(...b.variants.map((v) => v.price)) - Math.min(...a.variants.map((v) => v.price))
      );
    case "name-az":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function CollectionGrid({
  products,
  collectionName,
}: {
  products: Product[];
  collectionName: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("featured");
  const sorted = sortProducts(products, sortKey);

  return (
    <div>
      {/* Filter / sort bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} oils
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" className="gap-1.5 text-sm text-muted-foreground hover:text-foreground" />
            }
          >
            {SORT_LABELS[sortKey]}
            <ArrowUpDown className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            <DropdownMenuRadioGroup
              value={sortKey}
              onValueChange={(value) => setSortKey(value as SortKey)}
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {SORT_LABELS[key]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Product grid */}
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            collectionName={collectionName}
          />
        ))}
      </div>
    </div>
  );
}
