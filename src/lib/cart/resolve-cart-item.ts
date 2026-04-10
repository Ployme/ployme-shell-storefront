import type { CartItem, Product, ProductVariant } from "@/lib/types";
// Cart resolution uses the static PRODUCTS seed, not the KV-backed store,
// because the cart runs on the client. Admin-created products that only
// exist in KV won't resolve here — that's acceptable for the reference
// shell. A real storefront would hydrate product data from an API.
import { PRODUCTS } from "@/lib/data/products";
import { COLLECTIONS } from "@/lib/data/collections";
import type { Collection } from "@/lib/types";

export type ResolvedCartItem = {
  item: CartItem;
  product: Product;
  variant: ProductVariant;
  collection: Collection | undefined;
};

/**
 * Resolve a CartItem (productId + variantId + quantity) against the
 * static product catalogue. Returns null if the product or variant
 * can't be found (e.g. stale localStorage entry for a deleted product).
 */
export function resolveCartItem(item: CartItem): ResolvedCartItem | null {
  const product = PRODUCTS.find((p) => p.id === item.productId);
  if (!product) return null;
  const variant = product.variants.find((v) => v.id === item.variantId);
  if (!variant) return null;
  const collection = COLLECTIONS.find((c) => c.id === product.collectionId);
  return { item, product, variant, collection };
}

/**
 * Resolve all cart items, filtering out any that can't be matched.
 * Returns the resolved list plus the IDs of items that failed to resolve,
 * so the caller can clean them from cart state.
 */
export function resolveCartItems(items: CartItem[]): {
  resolved: ResolvedCartItem[];
  stale: CartItem[];
} {
  const resolved: ResolvedCartItem[] = [];
  const stale: CartItem[] = [];

  for (const item of items) {
    const result = resolveCartItem(item);
    if (result) {
      resolved.push(result);
    } else {
      stale.push(item);
    }
  }

  return { resolved, stale };
}
