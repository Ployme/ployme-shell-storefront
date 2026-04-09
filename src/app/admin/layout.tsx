"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ClipboardList, Settings, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {adminLinks.map((link) => {
        const Icon = link.icon;
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors",
              active
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-stone bg-muted/40 md:block">
        <div className="flex h-full flex-col gap-6 p-4">
          <div>
            <span className="font-display text-lg italic text-foreground">
              Oliveto
            </span>
            <span className="ml-1 text-xs text-muted-foreground">/ admin</span>
          </div>
          <SidebarNav />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-stone px-4 sm:px-6">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-muted/40">
              <SheetHeader>
                <SheetTitle className="font-display text-lg italic">
                  Oliveto
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    / admin
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="px-4">
                <SidebarNav />
              </div>
            </SheetContent>
          </Sheet>

          <span className="hidden text-sm font-medium text-foreground md:block">
            {/* spacer on desktop */}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Admin</span>
            <Button variant="ghost" size="icon">
              <LogOut className="size-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
