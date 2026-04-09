"use server";

import { revalidatePath } from "next/cache";
import type { Product, OrderStatus } from "@/lib/types";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/store/product-store";
import { updateOrderStatus } from "@/lib/store/order-store";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function adminCreateProduct(product: Product) {
  await createProduct(product);
  revalidateAll();
  return { success: true };
}

export async function adminUpdateProduct(id: string, patch: Partial<Product>) {
  const result = await updateProduct(id, patch);
  revalidateAll();
  return result ? { success: true } : { success: false };
}

export async function adminDeleteProduct(id: string) {
  const result = await deleteProduct(id);
  revalidateAll();
  return result ? { success: true } : { success: false };
}

export async function adminUpdateOrderStatus(id: string, status: OrderStatus) {
  const result = await updateOrderStatus(id, status);
  revalidateAll();
  return result ? { success: true } : { success: false };
}
