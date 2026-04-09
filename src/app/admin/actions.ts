"use server";

import { revalidatePath } from "next/cache";
import type { Product, OrderStatus } from "@/lib/types";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/store/product-store";
import { updateOrderStatus } from "@/lib/store/order-store";

export async function adminCreateProduct(product: Product) {
  await createProduct(product);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function adminUpdateProduct(id: string, patch: Partial<Product>) {
  const result = await updateProduct(id, patch);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return result ? { success: true } : { success: false };
}

export async function adminDeleteProduct(id: string) {
  const result = await deleteProduct(id);
  revalidatePath("/admin/products");
  return result ? { success: true } : { success: false };
}

export async function adminUpdateOrderStatus(id: string, status: OrderStatus) {
  const result = await updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  return result ? { success: true } : { success: false };
}
