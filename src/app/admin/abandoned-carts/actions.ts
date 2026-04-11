"use server";

import { revalidatePath } from "next/cache";
import {
  getAllAbandonments,
  updateAbandonment,
  type CartAbandonment,
} from "@/lib/store/abandoned-carts-store";
import { integrations } from "@/lib/integrations";

async function sendReminder(row: CartAbandonment): Promise<void> {
  const itemLines = row.items
    .map(
      (i) =>
        `<li>${i.snapshot.productName} (${i.snapshot.variantSize}) × ${i.quantity}</li>`
    )
    .join("");

  // Include the abandonment id as a token so the restore link can repopulate
  // the cart on click.
  await integrations.email.send({
    to: row.customerEmail,
    from: "hello@oliveto.com",
    subject: "You left something in your basket",
    html: `
      <h1>Still thinking it over?</h1>
      <p>Your basket is waiting:</p>
      <ul>${itemLines}</ul>
      <p><a href="/cart?restore=${row.id}">Return to your cart</a></p>
    `,
  });
}

export async function adminRunAbandonmentCheck(): Promise<{
  sent: number;
}> {
  const all = await getAllAbandonments();
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  let sent = 0;
  for (const row of all) {
    if (row.recovered) continue;
    if (row.reminderSentAt) continue;
    if (new Date(row.abandonedAt).getTime() > cutoff) continue;
    await sendReminder(row);
    await updateAbandonment(row.id, {
      reminderSentAt: new Date().toISOString(),
    });
    sent++;
  }
  revalidatePath("/admin/abandoned-carts");
  return { sent };
}

export async function adminSendAbandonmentReminder(
  id: string
): Promise<{ ok: boolean }> {
  const all = await getAllAbandonments();
  const row = all.find((r) => r.id === id);
  if (!row) return { ok: false };
  await sendReminder(row);
  await updateAbandonment(id, {
    reminderSentAt: new Date().toISOString(),
  });
  revalidatePath("/admin/abandoned-carts");
  return { ok: true };
}

export async function getRestoredCart(
  token: string
): Promise<CartAbandonment | null> {
  const all = await getAllAbandonments();
  return all.find((r) => r.id === token) ?? null;
}
