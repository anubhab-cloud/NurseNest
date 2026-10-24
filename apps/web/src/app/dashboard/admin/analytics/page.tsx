"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BookingDto, PaginatedDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { StatusPill } from "@/components/bookings/status";

export default function AdminAnalyticsPage() {
  const q = useQuery({ queryKey: ["admin-bookings", "chart"], queryFn: () => apiFetch<PaginatedDto<BookingDto>>("/api/v1/admin/bookings?limit=100") });
  if (q.isLoading) return <Skeleton className="h-96" />;
  if (q.isError) return <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />;
  const items = q.data?.items ?? [];
  const byService: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  for (const b of items) {
    const n = b.service?.name ?? "Other";
    byService[n] = (byService[n] ?? 0) + 1;
    byStatus[b.status] = (byStatus[b.status] ?? 0) + 1;
  }
  const chart = Object.entries(byService).map(([name, count]) => ({ name, count }));
  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">Based on the {items.length} most recent bookings{q.data && q.data.total > items.length ? ` of ${q.data.total}` : ""}.</p>
      <Panel eyebrow="Demand" title="Bookings by service">
        {chart.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No bookings to chart yet.</p> : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>)}
      </Panel>
      <Panel eyebrow="Pipeline" title="By status">
        <div className="flex flex-wrap gap-4">
          {(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const).map((s) => (
            <div key={s} className="rounded-2xl border p-4"><StatusPill status={s} /><p className="mt-2 font-display text-3xl">{byStatus[s] ?? 0}</p></div>))}
        </div>
      </Panel>
    </div>
  );
}
