"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import type { BookingDto, VitalRecordDto, PaginatedDto } from "@nursenest/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PatientOverviewPage() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["patient-bookings"],
    queryFn: () => apiFetch<BookingDto[]>("/api/v1/patients/me/bookings"),
  });
  const { data: vitalsPage } = useQuery({
    queryKey: ["patient-vitals"],
    queryFn: () => apiFetch<PaginatedDto<VitalRecordDto>>("/api/v1/patients/me/vitals?limit=3"),
  });

  const upcoming = bookings.filter((b) => !["COMPLETED", "CANCELLED"].includes(b.status)).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/patient/book-now">Book a visit</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground">No upcoming bookings.</p>
            ) : (
              upcoming.map((b) => (
                <div key={b.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{b.service?.name ?? "Visit"}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(b.scheduledAt)}</p>
                  </div>
                  <Badge>{b.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Vitals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(vitalsPage?.items ?? []).map((v) => (
              <p key={v.id} className="text-sm">
                HR {v.heartRate} · SpO2 {v.spo2}% · {formatDate(v.recordedAt)}
              </p>
            ))}
            <Button variant="link" asChild className="px-0">
              <Link href="/dashboard/patient/vitals">View all vitals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
