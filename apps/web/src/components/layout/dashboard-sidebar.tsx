"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 border-r bg-card p-4">
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm",
              pathname === l.href || pathname.startsWith(`${l.href}/`)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent",
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
