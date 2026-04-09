"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/shop/product-image";
import { adminDeleteProduct } from "../actions";

type EnrichedProduct = {
  product: Product;
  collectionName: string;
  priceRange: string;
  totalStock: number;
  variantCount: number;
};

export function ProductListClient({
  products,
}: {
  products: EnrichedProduct[];
}) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = products.filter((p) =>
    p.product.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await adminDeleteProduct(id);
    router.refresh();
  }

  return (
    <>
      <div className="mt-6 flex items-center gap-3">
        <div className="relative w-full max-w-80">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-3 font-medium" />
              <th className="pb-3 pr-3 font-medium">Name</th>
              <th className="hidden pb-3 pr-3 font-medium md:table-cell">
                Collection
              </th>
              <th className="hidden pb-3 pr-3 font-medium lg:table-cell">
                Variants
              </th>
              <th className="pb-3 pr-3 font-medium">Price</th>
              <th className="hidden pb-3 pr-3 font-medium sm:table-cell">
                Stock
              </th>
              <th className="hidden pb-3 pr-3 font-medium sm:table-cell">
                Tags
              </th>
              <th className="pb-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(
              ({
                product,
                collectionName,
                priceRange,
                totalStock,
                variantCount,
              }) => (
                <tr
                  key={product.id}
                  className="border-b border-stone/60 transition-colors hover:bg-muted/30"
                >
                  {/* Thumbnail */}
                  <td className="py-3 pr-3">
                    <div className="size-10 overflow-hidden rounded-sm">
                      <ProductImage
                        src={product.images[0] ?? ""}
                        alt={product.name}
                        productName={product.name}
                        className="size-10"
                        size="xs"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-3 pr-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium text-foreground hover:text-olive"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-[12px] text-muted-foreground md:hidden">
                      {collectionName}
                    </p>
                  </td>

                  {/* Collection */}
                  <td className="hidden py-3 pr-3 text-muted-foreground md:table-cell">
                    {collectionName}
                  </td>

                  {/* Variants */}
                  <td className="hidden py-3 pr-3 text-muted-foreground lg:table-cell">
                    {variantCount} size{variantCount !== 1 ? "s" : ""}
                  </td>

                  {/* Price */}
                  <td className="py-3 pr-3 tabular-nums text-foreground">
                    {priceRange}
                  </td>

                  {/* Stock */}
                  <td className="hidden py-3 pr-3 tabular-nums sm:table-cell">
                    <span
                      className={
                        totalStock < 20
                          ? "text-terracotta"
                          : "text-muted-foreground"
                      }
                    >
                      {totalStock}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="hidden py-3 pr-3 sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-sm px-1.5 py-0 text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="ghost" size="icon-xs">
                          <Pencil className="size-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() =>
                          handleDelete(product.id, product.name)
                        }
                      >
                        <Trash2 className="size-3.5 text-muted-foreground hover:text-terracotta" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No products match &ldquo;{search}&rdquo;
          </p>
        )}
      </div>
    </>
  );
}
