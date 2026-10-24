"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function isActive(pathname: string, href: string, all: { href: string }[]) {
  if (pathname === href) return true;
  if (!pathname.startsWith(`${href}/`)) return false;
  return !all.some((o) => o.href !== href && o.href.startsWith(href) && (pathname === o.href || pathname.startsWith(`${o.href}/`)));
}

export function DashboardSidebar({ links, onNavigate }: { links: { href: string; label: string }[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active = isActive(pathname, l.href, links);
        return (
          <Link key={l.href} href={l.href} onClick={onNavigate}
            data-testid={`link-dash-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            className={cn("relative rounded-xl px-4 py-2.5 text-sm transition",
              active ? "bg-primary font-medium text-primary-foreground" : "text-foreground/75 hover:bg-accent hover:text-foreground")}>
            {active && <span className="absolute -left-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-[hsl(var(--marigold))]" />}
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
