"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart/cart-context";
import { signOutAction } from "@/app/(shop)/account/actions";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop", label: "Collections" },
  { href: "#", label: "Our story" },
  { href: "#", label: "Journal" },
];

type HeaderProps = {
  customer: { name: string; email: string } | null;
};

export function HeaderClient({ customer }: HeaderProps) {
  const { itemCount } = useCart();
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-2xl italic tracking-tight text-foreground"
        >
          Oliveto
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {/* Account */}
          {customer ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 px-2"
                onClick={() => setAccountOpen((o) => !o)}
              >
                <User className="size-4" />
                <span className="hidden text-sm sm:inline">
                  {customer.name.split(" ")[0]}
                </span>
                <ChevronDown className="size-3" />
              </Button>
              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-48 rounded-sm border border-stone bg-background p-1 shadow-md"
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  <Link
                    href="/account"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded-sm px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    My account
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded-sm px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    My orders
                  </Link>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="block w-full rounded-sm px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/account/signin"
              className="inline-flex h-9 items-center gap-1.5 rounded-sm px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <User className="size-4" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}

          {/* Cart icon */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="size-5" />
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {itemCount}
              </span>
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-xl italic">
                  Oliveto
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                {customer ? (
                  <Link
                    href="/account"
                    className="text-sm tracking-wide text-muted-foreground hover:text-foreground"
                  >
                    My account
                  </Link>
                ) : (
                  <Link
                    href="/account/signin"
                    className="text-sm tracking-wide text-muted-foreground hover:text-foreground"
                  >
                    Sign in
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
