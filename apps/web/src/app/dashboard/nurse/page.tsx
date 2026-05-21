"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { BookingDto } from "@nursenest/types";
import { formatDate } from "@/lib/utils";
import { LocationMap } from "@/components/maps/location-map";
import Link from "next/link";

export default function NurseOverviewPage() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["nurse-bookings"],
    queryFn: () => apiFetch<BookingDto[]>("/api/v1/nurse/me/bookings"),
  });

  const today = bookings.filter((b) => {
    const d = new Date(b.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString() && b.status !== "CANCELLED";
  });

  const active = bookings.find((b) => b.status === "IN_PROGRESS") ?? today[0];

  useEffect(() => {
    const id = setInterval(() => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition((pos) => {
        void fetch("/api/v1/nurses/me/location", {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        });
      });
    }, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {today.map((b) => (
            <div key={b.id}>
              <p className="font-medium">{b.patient?.fullName ?? "Patient"}</p>
              <p className="text-sm text-muted-foreground">{formatDate(b.scheduledAt)} — {b.status}</p>
              <Link href={`/dashboard/nurse/patient/${b.patientId}`} className="text-sm text-primary">
                View patient
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
      {active?.patient?.lat && active.patient.lng && (
        <Card>
          <CardHeader>
            <CardTitle>Active Visit Map</CardTitle>
          </CardHeader>
          <CardContent>
            <LocationMap lat={active.patient.lat} lng={active.patient.lng} label={active.patient.fullName} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
