import Link from "next/link";
import { integrations } from "@/lib/integrations";

const navLinks = [
  { href: "/account", label: "Account" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await integrations.auth.getCurrentCustomer();

  // Public auth-flow pages (signin/signup/forgot/reset) render their own
  // full-width layout inside /account but skip the sidebar. We render the
  // sidebar only for signed-in users; when signed out, the children route
  // handles its own presentation.
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      {customer ? (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
              Your account
            </p>
            <p className="mt-2 font-display text-2xl italic text-foreground">
              {customer.name.split(" ")[0]}
            </p>
            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
