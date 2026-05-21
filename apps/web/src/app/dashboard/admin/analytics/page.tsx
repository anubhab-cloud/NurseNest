"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { apiFetch } from "@/lib/api";
import type { AdminStatsDto, BookingDto, PaginatedDto } from "@nursenest/types";

export default function AdminAnalyticsPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch<AdminStatsDto>("/api/v1/admin/stats"),
  });
  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings-chart"],
    queryFn: () => apiFetch<PaginatedDto<BookingDto>>("/api/v1/admin/bookings?limit=100"),
  });

  const byService: Record<string, number> = {};
  for (const b of bookings?.items ?? []) {
    const name = b.service?.name ?? "Other";
    byService[name] = (byService[name] ?? 0) + 1;
  }
  const chartData = Object.entries(byService).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform KPIs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Bookings: {stats?.totalBookings ?? 0}</p>
            <p>Revenue (paise): {stats?.totalRevenue ?? 0}</p>
            <p>Active nurses: {stats?.activeNurses ?? 0}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bookings by Service</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
