"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { AdminStatsDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton, ErrorNote } from "@/components/common/panel";
import { formatCurrency } from "@/lib/utils";

export default function AdminOverviewPage() {
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: () => apiFetch<AdminStatsDto>("/api/v1/admin/stats") });
  if (q.isLoading) return <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;
  if (q.isError || !q.data) return <ErrorNote message={q.error?.message ?? "No data"} onRetry={() => void q.refetch()} />;
  const s = q.data;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="rounded-3xl bg-primary p-7 text-primary-foreground md:row-span-2">
          <p className="eyebrow !text-[hsl(var(--marigold))]">Paid revenue</p>
          <p className="mt-3 font-display text-5xl">{formatCurrency(s.totalRevenue)}</p>
          <p className="mt-6 text-sm opacity-75">{s.bookingsToday} booking{s.bookingsToday === 1 ? "" : "s"} scheduled today</p>
          <Button asChild variant="secondary" className="mt-6 rounded-full"><Link href="/dashboard/admin/bookings">Manage bookings</Link></Button>
        </div>
        {[["Total bookings", s.totalBookings], ["Active nurses", s.activeNurses], ["Patients", s.totalPatients], ["Today", s.bookingsToday]].map(([k, v]) => (
          <div key={k as string} className="rounded-3xl border bg-card p-6"><p className="eyebrow">{k}</p><p className="mt-2 font-display text-4xl">{v}</p></div>
        ))}
      </div>
    </div>
  );
}
