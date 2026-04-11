import { redirect } from "next/navigation";
import { integrations } from "@/lib/integrations";
import { AddressesClient } from "./addresses-client";

export default async function AccountAddressesPage() {
  const customer = await integrations.auth.getCurrentCustomer();
  if (!customer) redirect("/account/signin?redirect=/account/addresses");

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Saved addresses
      </p>
      <h1 className="mt-2 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground">
        Addresses
      </h1>
      <div className="mt-8">
        <AddressesClient initialAddresses={customer.addresses} />
      </div>
    </div>
  );
}
