"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import type { BookingDto } from "@nursenest/types";
import { formatDate } from "@/lib/utils";

export default function NurseSchedulePage() {
  const qc = useQueryClient();
  const { data: bookings = [] } = useQuery({
    queryKey: ["nurse-bookings"],
    queryFn: () => apiFetch<BookingDto[]>("/api/v1/nurse/me/bookings"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch<BookingDto>(`/api/v1/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["nurse-bookings"] }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
            <div>
              <p className="font-medium">{b.patient?.fullName}</p>
              <p className="text-sm text-muted-foreground">{formatDate(b.scheduledAt)}</p>
            </div>
            <div className="flex gap-2">
              <Badge>{b.status}</Badge>
              {b.status === "PENDING" && (
                <Button size="sm" onClick={() => updateStatus.mutate({ id: b.id, status: "CONFIRMED" })}>
                  Confirm
                </Button>
              )}
              {b.status === "CONFIRMED" && (
                <Button size="sm" onClick={() => updateStatus.mutate({ id: b.id, status: "IN_PROGRESS" })}>
                  Start
                </Button>
              )}
              {b.status === "IN_PROGRESS" && (
                <Button size="sm" asChild>
                  <a href={`/dashboard/nurse/notes/${b.id}`}>Complete</a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
