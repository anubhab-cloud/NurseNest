"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { AdminStatsDto } from "@nursenest/types";
import { formatCurrency } from "@/lib/utils";

export default function AdminOverviewPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch<AdminStatsDto>("/api/v1/admin/stats"),
  });

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: "Total Bookings", value: stats.totalBookings },
    { label: "Revenue", value: formatCurrency(stats.totalRevenue) },
    { label: "Active Nurses", value: stats.activeNurses },
    { label: "Patients", value: stats.totalPatients },
    { label: "Bookings Today", value: stats.bookingsToday },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
