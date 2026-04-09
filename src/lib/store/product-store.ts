import "server-only";

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Product } from "@/lib/types";
import { PRODUCTS } from "@/lib/data/products";

const DATA_DIR = path.join(process.cwd(), "src/lib/data");
const JSON_PATH = path.join(DATA_DIR, "products.json");

async function readStore(): Promise<Product[]> {
  if (!existsSync(JSON_PATH)) {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(JSON_PATH, JSON.stringify(PRODUCTS, null, 2), "utf-8");
    return PRODUCTS;
  }
  const raw = await readFile(JSON_PATH, "utf-8");
  return JSON.parse(raw) as Product[];
}

async function writeStore(products: Product[]): Promise<void> {
  await writeFile(JSON_PATH, JSON.stringify(products, null, 2), "utf-8");
}

export async function getAllProducts(): Promise<Product[]> {
  return readStore();
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await readStore();
  return products.find((p) => p.id === slug);
}

export async function getProductsByCollection(
  collectionId: string
): Promise<Product[]> {
  const products = await readStore();
  return products.filter((p) => p.collectionId === collectionId);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await readStore();
  return products.filter((p) => p.featured);
}

export async function createProduct(product: Product): Promise<Product> {
  const products = await readStore();
  products.push(product);
  await writeStore(products);
  return product;
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>
): Promise<Product | undefined> {
  const products = await readStore();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  products[index] = { ...products[index], ...patch };
  await writeStore(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readStore();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  await writeStore(products);
  return true;
}
