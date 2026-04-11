import Link from "next/link";
import { redirect } from "next/navigation";
import { integrations } from "@/lib/integrations";
import { getOrdersForCustomer } from "@/lib/store/order-store";
import { formatPrice } from "@/lib/types";

export default async function AccountHomePage() {
  const customer = await integrations.auth.getCurrentCustomer();
  if (!customer) {
    redirect("/account/signin?redirect=/account");
  }

  const orders = (await getOrdersForCustomer(customer.id, customer.email))
    .slice()
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Welcome back
      </p>
      <h1 className="mt-2 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground">
        Hello, {customer.name.split(" ")[0]}
      </h1>

      <div className="mt-8 rounded-sm border border-stone p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Contact
        </p>
        <p className="mt-2 text-sm text-foreground">{customer.name}</p>
        <p className="text-sm text-muted-foreground">{customer.email}</p>
      </div>

      <div className="mt-8 rounded-sm border border-stone p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Default address
        </p>
        {customer.addresses[0] ? (
          <div className="mt-2 text-sm text-foreground">
            <p>{customer.addresses[0].line1}</p>
            {customer.addresses[0].line2 && <p>{customer.addresses[0].line2}</p>}
            <p>
              {customer.addresses[0].city}, {customer.addresses[0].postcode}
            </p>
            <p>{customer.addresses[0].country}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            No saved addresses.{" "}
            <Link
              href="/account/addresses"
              className="text-olive underline underline-offset-2"
            >
              Add one
            </Link>
          </p>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl italic text-foreground">
            Your orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            You haven&rsquo;t placed any orders yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-stone rounded-sm border border-stone">
            {orders.map((order) => (
              <li key={order.id} className="px-5 py-4">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.id}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {order.status}
                    </p>
                  </div>
                  <span className="tabular-nums text-sm text-foreground">
                    {formatPrice(order.total)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
