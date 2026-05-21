"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import type { BookingDto, PaginatedDto } from "@nursenest/types";
import { formatDate } from "@/lib/utils";

export default function AdminBookingsPage() {
  const { data } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => apiFetch<PaginatedDto<BookingDto>>("/api/v1/admin/bookings?limit=50"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(data?.items ?? []).map((b) => (
          <div key={b.id} className="flex justify-between border-b pb-2">
            <div>
              <p className="font-medium">{b.service?.name}</p>
              <p className="text-sm text-muted-foreground">{formatDate(b.scheduledAt)}</p>
            </div>
            <Badge>{b.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
