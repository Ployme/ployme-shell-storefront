export type Collection = {
  id: string;
  name: string;
  description: string;
  heroImage: string;
};

export type ProductVariant = {
  id: string;
  size: string;
  price: number;
  sku: string;
  inventory: number;
};

export type Product = {
  id: string;
  name: string;
  collectionId: string;
  origin: string;
  producer: string;
  harvest: string;
  shortDescription: string;
  description: string;
  tastingNotes: string[];
  pairings: string[];
  images: string[];
  variants: ProductVariant[];
  tags: ("bestseller" | "new" | "limited" | "organic")[];
  featured: boolean;
  /** Per-unit shipping weight in grams. Defaults to 500g when unset. */
  weight?: number;
  /** VAT rate applied at checkout when shipping to a VAT-charging region.
   *  Defaults to 0.20 (UK standard rate). Stored at product level so bundles
   *  or non-standard goods can override. */
  vatRate?: number;
};

export type CartItemSnapshot = {
  productName: string;
  productSlug: string;
  collectionId: string;
  collectionName: string;
  origin: string;
  image: string;
  variantSize: string;
  variantPrice: number;
  variantSku: string;
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  snapshot: CartItemSnapshot;
};

export type Cart = {
  items: CartItem[];
  updatedAt: string;
};

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
};

export type Customer = {
  id: string;
  email: string;
  name: string;
  addresses: Address[];
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  customerId: string;
  customerEmail?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  /** Subtotal excluding VAT, in pence. Older orders may not have this. */
  subtotalExVat?: number;
  /** VAT amount in pence. */
  vatAmount?: number;
  /** Decimal VAT rate applied (e.g. 0.20 for UK standard). */
  vatRate?: number;
  /** Discount applied in pence (positive number, already subtracted from total). */
  discountAmount?: number;
  discountCode?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: Address;
};

export function formatPrice(pence: number): string {
  const pounds = pence / 100;
  return `£${pounds.toFixed(2)}`;
}

export function getVariantLabel(variant: ProductVariant): string {
  return `${variant.size} — ${formatPrice(variant.price)}`;
}

export function isSoldOut(product: Product): boolean {
  return product.variants.every((v) => v.inventory <= 0);
}

export function getProductWeight(product: Product): number {
  return product.weight ?? 500;
}
