"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck } from "lucide-react";
import type { BookingDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { StatusPill } from "@/components/bookings/status";
import { LocationMap } from "@/components/maps/location-map";
import { formatDate } from "@/lib/utils";

export default function NurseOverviewPage() {
  const q = useQuery({ queryKey: ["nurse-bookings"], queryFn: () => apiFetch<BookingDto[]>("/api/v1/nurse/me/bookings") });
  const bookings = q.data ?? [];
  const todayStr = new Date().toDateString();
  const today = bookings.filter((b) => new Date(b.scheduledAt).toDateString() === todayStr && b.status !== "CANCELLED").sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const active = bookings.find((b) => b.status === "IN_PROGRESS") ?? today[0];

  useEffect(() => {
    const id = setInterval(() => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition((pos) => {
        void fetch("/api/v1/nurses/me/location", {
          method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        }).catch(() => undefined);
      });
    }, 15000);
    return () => clearInterval(id);
  }, []);

  if (q.isLoading) return <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-40" /><Skeleton className="h-40" /></div>;
  if (q.isError) return <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="rounded-3xl bg-primary p-7 text-primary-foreground">
          <p className="eyebrow !text-[hsl(var(--marigold))]">Today</p>
          <p className="mt-2 font-display text-4xl">{today.length} visit{today.length === 1 ? "" : "s"}</p>
          <Button asChild variant="secondary" className="mt-5 rounded-full"><Link href="/dashboard/nurse/schedule">Open schedule</Link></Button>
        </div>
        <div className="rounded-3xl border bg-card p-6"><p className="eyebrow">Awaiting confirmation</p><p className="mt-2 font-display text-4xl">{pending}</p></div>
        <div className="rounded-3xl border bg-card p-6"><p className="eyebrow">In progress</p><p className="mt-2 font-display text-4xl">{bookings.filter((b) => b.status === "IN_PROGRESS").length}</p></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel eyebrow="Schedule" title="Today's visits">
          {today.length === 0 ? <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><CalendarCheck className="h-4 w-4" /> No visits today.</p>
            : <ul className="divide-y">{today.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">{b.patient?.fullName ?? "Patient"}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(b.scheduledAt)} &middot; {b.service?.name ?? "Visit"}</p>
                    <Link href={`/dashboard/nurse/patient/${b.patientId}`} className="text-xs font-medium text-primary hover:underline">Patient record</Link>
                  </div>
                  <StatusPill status={b.status} />
                </li>))}</ul>}
        </Panel>
        {active?.patient?.lat != null && active.patient.lng != null ? (
          <Panel eyebrow="Location" title={active.patient.fullName}>
            <div className="overflow-hidden rounded-2xl"><LocationMap lat={active.patient.lat} lng={active.patient.lng} label={active.patient.fullName} /></div>
            {active.patient.address && <p className="mt-3 text-sm text-muted-foreground">{active.patient.address}</p>}
          </Panel>
        ) : <div className="grid place-items-center rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground">A map appears when your next visit has a saved patient location.</div>}
      </div>
    </div>
  );
}
