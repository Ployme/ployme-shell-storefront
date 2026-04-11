"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Address, Customer } from "@/lib/types";
import { integrations } from "@/lib/integrations";

// ---------------------------------------------------------------------------
// Customer account server actions. Every action flows through the
// AuthProvider interface so real adapters can swap in without touching UI.
// ---------------------------------------------------------------------------

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function signUpAction(formData: FormData): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!name || !email || !password) {
    return { ok: false, error: "All fields are required" };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters" };
  }
  if (password !== confirm) {
    return { ok: false, error: "Passwords do not match" };
  }

  try {
    await integrations.auth.signUp(email, password, name);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Sign up failed",
    };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signInAction(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { ok: false, error: "Email and password are required" };
  }
  try {
    await integrations.auth.signIn(email, password);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Sign in failed",
    };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signOutAction(): Promise<void> {
  await integrations.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordResetAction(
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { ok: false, error: "Email is required" };
  try {
    await integrations.auth.requestPasswordReset(email);
    return { ok: true };
  } catch {
    return { ok: true }; // always succeed silently
  }
}

export async function resetPasswordAction(
  formData: FormData
): Promise<AuthResult> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  if (!token) return { ok: false, error: "Missing reset token" };
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters" };
  }
  if (password !== confirm) {
    return { ok: false, error: "Passwords do not match" };
  }
  try {
    await integrations.auth.resetPassword(token, password);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Reset failed",
    };
  }
}

export async function updateProfileAction(
  formData: FormData
): Promise<AuthResult> {
  const customer = await integrations.auth.getCurrentCustomer();
  if (!customer) return { ok: false, error: "Not signed in" };
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  try {
    await integrations.auth.updateCustomer(customer.id, { name, email });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Update failed",
    };
  }
  revalidatePath("/account");
  return { ok: true };
}

export async function updatePasswordAction(
  formData: FormData
): Promise<AuthResult> {
  const customer = await integrations.auth.getCurrentCustomer();
  if (!customer) return { ok: false, error: "Not signed in" };
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  if (newPassword.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters" };
  }
  if (newPassword !== confirm) {
    return { ok: false, error: "Passwords do not match" };
  }
  try {
    await integrations.auth.updatePassword(
      customer.id,
      currentPassword,
      newPassword
    );
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Update failed",
    };
  }
}

export async function deleteAccountAction(
  formData: FormData
): Promise<AuthResult> {
  const customer = await integrations.auth.getCurrentCustomer();
  if (!customer) return { ok: false, error: "Not signed in" };
  const password = String(formData.get("password") ?? "");
  try {
    await integrations.auth.deleteCustomer(customer.id, password);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Delete failed",
    };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveAddressesAction(
  addresses: Address[]
): Promise<{ ok: boolean; customer?: Customer; error?: string }> {
  const customer = await integrations.auth.getCurrentCustomer();
  if (!customer) return { ok: false, error: "Not signed in" };
  try {
    const updated = await integrations.auth.setAddresses(customer.id, addresses);
    revalidatePath("/account");
    return { ok: true, customer: updated };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Save failed",
    };
  }
}
