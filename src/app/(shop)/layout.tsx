"use client";

import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop/collections", label: "Collections" },
  { href: "/about", label: "Our story" },
  { href: "/journal", label: "Journal" },
];

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-display text-2xl italic tracking-tight text-foreground"
          >
            Oliveto
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Cart icon */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="size-5" />
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  0
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
                      key={link.href}
                      href={link.href}
                      className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

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
    </>
  );
}
