// In-memory product store seeded from the static product catalogue.
// Mutations live only for the lifetime of the serverless instance —
// this is intentional. We're a reference shell, not a real backend.

import "server-only";

import type { Product } from "@/lib/types";
import { PRODUCTS } from "@/lib/data/products";

let products: Product[] = [...PRODUCTS];

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  return products.find((p) => p.id === slug);
}

export async function getProductsByCollection(
  collectionId: string
): Promise<Product[]> {
  return products.filter((p) => p.collectionId === collectionId);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((p) => p.featured);
}

export async function createProduct(product: Product): Promise<Product> {
  products.push(product);
  return product;
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>
): Promise<Product | undefined> {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  products[index] = { ...products[index], ...patch };
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}
