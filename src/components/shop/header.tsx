import { integrations } from "@/lib/integrations";
import { HeaderClient } from "./header-client";

export async function ShopHeader() {
  const customer = await integrations.auth.getCurrentCustomer();

  return (
    <HeaderClient
      customer={
        customer ? { name: customer.name, email: customer.email } : null
      }
    />
  );
}
