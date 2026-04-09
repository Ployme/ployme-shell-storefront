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
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
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
  items: CartItem[];
  subtotal: number;
  shipping: number;
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
