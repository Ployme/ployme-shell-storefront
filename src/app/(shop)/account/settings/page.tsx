import { redirect } from "next/navigation";
import { integrations } from "@/lib/integrations";
import { SettingsClient } from "./settings-client";

export default async function AccountSettingsPage() {
  const customer = await integrations.auth.getCurrentCustomer();
  if (!customer) redirect("/account/signin?redirect=/account/settings");

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Settings
      </p>
      <h1 className="mt-2 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground">
        Your details
      </h1>
      <div className="mt-8">
        <SettingsClient
          initialName={customer.name}
          initialEmail={customer.email}
        />
      </div>
    </div>
  );
}
