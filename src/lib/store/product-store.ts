import "server-only";

import type { Product } from "@/lib/types";
import { PRODUCTS } from "@/lib/data/products";

// ---------------------------------------------------------------------------
// KV-backed product store with in-memory fallback
// ---------------------------------------------------------------------------

let kvClient: import("@upstash/redis").Redis | null = null;
let kvChecked = false;
let fallbackProducts: Product[] | null = null;

function getKV() {
  if (kvChecked) return kvClient;
  kvChecked = true;

  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL;
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN;

  if (redisUrl && redisToken) {
    console.log('[store] using KV naming:',
      process.env.UPSTASH_REDIS_REST_URL ? 'upstash' : 'kv');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Redis } = require("@upstash/redis") as typeof import("@upstash/redis");
    kvClient = new Redis({ url: redisUrl, token: redisToken });
  } else {
    console.warn(
      "WARN: KV not configured, using in-memory store. Data will not persist across serverless instances."
    );
  }

  return kvClient;
}

const NAMESPACE = process.env.KV_NAMESPACE ?? 'oliveto';
const productsKey = `${NAMESPACE}:products:all`;
console.log('[store] active namespace:', NAMESPACE);

// -- helpers ----------------------------------------------------------------

async function readAll(): Promise<Product[]> {
  const kv = getKV();

  if (!kv) {
    if (!fallbackProducts) fallbackProducts = [...PRODUCTS];
    return fallbackProducts;
  }

  const data = await kv.get<Product[]>(productsKey);
  if (data) return data;

  // Seed from static catalogue on first access
  await kv.set(productsKey, PRODUCTS);
  return [...PRODUCTS];
}

async function writeAll(products: Product[]): Promise<void> {
  const kv = getKV();

  if (!kv) {
    fallbackProducts = products;
    return;
  }

  await kv.set(productsKey, products);
}

// -- public API (unchanged) -------------------------------------------------

export async function getAllProducts(): Promise<Product[]> {
  return readAll();
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await readAll();
  return products.find((p) => p.id === slug);
}

export async function getProductsByCollection(
  collectionId: string
): Promise<Product[]> {
  const products = await readAll();
  return products.filter((p) => p.collectionId === collectionId);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await readAll();
  return products.filter((p) => p.featured);
}

export async function createProduct(product: Product): Promise<Product> {
  const products = await readAll();
  products.push(product);
  await writeAll(products);
  return product;
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>
): Promise<Product | undefined> {
  const products = await readAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  products[index] = { ...products[index], ...patch };
  await writeAll(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  await writeAll(products);
  return true;
}
