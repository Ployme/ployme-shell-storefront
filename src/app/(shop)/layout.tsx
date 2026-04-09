"use client";

import { CartProvider } from "@/lib/cart/cart-context";
import { ShopHeader } from "@/components/shop/header";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <ShopHeader />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-stone">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span className="font-display text-lg italic text-foreground">
            Oliveto
          </span>
          <span className="text-sm text-muted-foreground">
            Oils with origin.
          </span>
        </div>
      </footer>
    </CartProvider>
  );
}
