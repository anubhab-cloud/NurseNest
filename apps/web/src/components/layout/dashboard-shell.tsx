"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Home, LogOut, Menu, X } from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export function DashboardShell({ title, links, children }: { title: string; links: { href: string; label: string }[]; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-[100dvh]">
      <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 flex-col border-r bg-card/70 p-5 md:flex">
        <Logo />
        <p className="eyebrow mb-3 mt-10 px-4">{title}</p>
        <DashboardSidebar links={links} />
        <Button variant="ghost" className="mt-auto justify-start gap-2" onClick={() => void signOut({ callbackUrl: "/" })} data-testid="button-logout">
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between"><Logo /><button aria-label="Close menu" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button></div>
            <p className="eyebrow mb-3 mt-8 px-4">{title}</p>
            <DashboardSidebar links={links} onNavigate={() => setOpen(false)} />
            <Button variant="ghost" className="mt-auto justify-start gap-2" onClick={() => void signOut({ callbackUrl: "/" })}><LogOut className="h-4 w-4" /> Log out</Button>
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button className="grid h-9 w-9 place-items-center rounded-full border md:hidden" aria-label="Open menu" onClick={() => setOpen(true)} data-testid="button-dash-menu">
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-xl font-medium">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="rounded-full"><Link href="/"><Home className="mr-1.5 h-4 w-4" /> Site</Link></Button>
          </div>
        </header>
        <main className="rise flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
