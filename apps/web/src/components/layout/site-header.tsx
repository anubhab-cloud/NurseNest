"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/nurses", label: "Nurses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const dash: Record<string, string> = {
  PATIENT: "/dashboard/patient",
  NURSE: "/dashboard/nurse",
  ADMIN: "/dashboard/admin",
};

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const dashHref = role ? dash[role] : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              data-testid={`link-nav-${n.label.toLowerCase()}`}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition hover:bg-accent",
                pathname.startsWith(n.href) && "bg-accent font-medium text-accent-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {dashHref ? (
            <Button asChild className="rounded-full">
              <Link href={dashHref}>My dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-full">
                <Link href="/login" data-testid="link-login">Sign in</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/register" data-testid="link-register">Arrange care</Link>
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open menu"
            data-testid="button-mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-background px-4 pb-6 pt-2 md:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b py-4 font-display text-2xl">
              {n.label}
            </Link>
          ))}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {dashHref ? (
              <Button asChild className="col-span-2 rounded-full"><Link href={dashHref}>My dashboard</Link></Button>
            ) : (
              <>
                <Button variant="outline" asChild className="rounded-full"><Link href="/login">Sign in</Link></Button>
                <Button asChild className="rounded-full"><Link href="/register">Arrange care</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
