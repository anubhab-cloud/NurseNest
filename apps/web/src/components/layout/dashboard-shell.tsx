"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Button } from "@/components/ui/button";

export function DashboardShell({
  title,
  links,
  children,
}: {
  title: string;
  links: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar links={links} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <h1 className="font-semibold">{title}</h1>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="outline" onClick={() => void signOut({ callbackUrl: "/" })}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
