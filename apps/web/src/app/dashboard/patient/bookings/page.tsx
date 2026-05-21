"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { BookingDto, ApiResponse } from "@nursenest/types";
import { formatDate } from "@/lib/utils";

export default function PatientBookingsPage() {
  const qc = useQueryClient();
  const { data: bookings = [] } = useQuery({
    queryKey: ["patient-bookings"],
    queryFn: () => apiFetch<BookingDto[]>("/api/v1/patients/me/bookings"),
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/bookings/${id}`, { method: "DELETE", credentials: "include" });
      const json = (await res.json()) as ApiResponse<BookingDto>;
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["patient-bookings"] }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
            <div>
              <p className="font-medium">{b.service?.name}</p>
              <p className="text-sm text-muted-foreground">{formatDate(b.scheduledAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{b.status}</Badge>
              {["PENDING", "CONFIRMED"].includes(b.status) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => cancel.mutate(b.id)}
                  disabled={cancel.isPending}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
