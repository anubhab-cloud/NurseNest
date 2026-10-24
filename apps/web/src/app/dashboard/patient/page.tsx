"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CalendarPlus, CheckCheck, HeartPulse } from "lucide-react";
import type { BookingDto, NotificationDto, PaginatedDto, VitalRecordDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { StatusPill } from "@/components/bookings/status";
import { cn, formatDate } from "@/lib/utils";

export default function PatientOverviewPage() {
  const qc = useQueryClient();
  const bookingsQ = useQuery({ queryKey: ["patient-bookings"], queryFn: () => apiFetch<BookingDto[]>("/api/v1/patients/me/bookings") });
  const vitalsQ = useQuery({ queryKey: ["patient-vitals", 3], queryFn: () => apiFetch<PaginatedDto<VitalRecordDto>>("/api/v1/patients/me/vitals?limit=3") });
  const notesQ = useQuery({ queryKey: ["patient-notifications"], queryFn: () => apiFetch<NotificationDto[]>("/api/v1/patients/me/notifications") });

  const markRead = useMutation({
    mutationFn: (id: string) => apiFetch<NotificationDto>(`/api/v1/patients/me/notifications/${id}/read`, { method: "PATCH" }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["patient-notifications"] }),
  });

  const upcoming = (bookingsQ.data ?? []).filter((b) => !["COMPLETED", "CANCELLED"].includes(b.status)).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)).slice(0, 4);
  const notifications = notesQ.data ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;
  const latest = vitalsQ.data?.items[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-primary p-6 text-primary-foreground md:flex-row md:items-end md:p-8">
        <div>
          <p className="eyebrow !text-[hsl(var(--marigold))]">Overview</p>
          <h2 className="mt-2 text-3xl font-medium md:text-4xl">{upcoming.length ? `${upcoming.length} upcoming visit${upcoming.length > 1 ? "s" : ""}` : "No visits scheduled"}</h2>
        </div>
        <Button asChild variant="secondary" className="rounded-full"><Link href="/dashboard/patient/book-now"><CalendarPlus className="mr-2 h-4 w-4" /> Book a visit</Link></Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel eyebrow="Schedule" title="Upcoming visits" action={<Button variant="link" asChild className="px-0"><Link href="/dashboard/patient/bookings">All bookings</Link></Button>}>
          {bookingsQ.isLoading ? <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
            : bookingsQ.isError ? <ErrorNote message={bookingsQ.error.message} onRetry={() => void bookingsQ.refetch()} />
            : upcoming.length === 0 ? <p className="py-6 text-sm text-muted-foreground">Nothing scheduled. Book a visit when you need one.</p>
            : <ul className="divide-y">{upcoming.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                  <div><p className="font-medium">{b.service?.name ?? "Visit"}</p><p className="text-xs text-muted-foreground">{formatDate(b.scheduledAt)} &middot; {b.nurse?.fullName ?? "Nurse to be assigned"}</p></div>
                  <StatusPill status={b.status} />
                </li>))}</ul>}
        </Panel>

        <Panel eyebrow="Latest reading" title="Vitals" action={<Button variant="link" asChild className="px-0"><Link href="/dashboard/patient/vitals">History</Link></Button>}>
          {vitalsQ.isLoading ? <Skeleton className="h-32" />
            : vitalsQ.isError ? <ErrorNote message={vitalsQ.error.message} onRetry={() => void vitalsQ.refetch()} />
            : !latest ? <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><HeartPulse className="h-4 w-4" /> Vitals appear after a nurse records them during a visit.</p>
            : <>
                <dl className="grid grid-cols-2 gap-3">
                  {[["Heart rate", `${latest.heartRate}`, "bpm"], ["Blood pressure", `${latest.systolic}/${latest.diastolic}`, "mmHg"], ["SpO2", `${latest.spo2}`, "%"], ["Temperature", `${latest.temperature}`, "°C"]].map(([k, v, u]) => (
                    <div key={k} className="rounded-2xl bg-muted/60 p-3"><dt className="eyebrow">{k}</dt><dd className="mt-1 font-display text-2xl">{v}<span className="ml-1 text-xs text-muted-foreground">{u}</span></dd></div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">Recorded {formatDate(latest.recordedAt)}</p>
              </>}
        </Panel>
      </div>

      <Panel eyebrow={unread ? `${unread} unread` : "All caught up"} title="Notifications">
        {markRead.isError && <div className="mb-3"><ErrorNote message={markRead.error.message} /></div>}
        {notesQ.isLoading ? <div className="space-y-3"><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
          : notesQ.isError ? <ErrorNote message={notesQ.error.message} onRetry={() => void notesQ.refetch()} />
          : notifications.length === 0 ? <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Bell className="h-4 w-4" /> No notifications yet.</p>
          : <ul className="space-y-2">{notifications.map((n) => (
              <li key={n.id} data-testid={`row-notification-${n.id}`} className={cn("flex items-start gap-3 rounded-2xl border p-4", !n.isRead && "border-[hsl(var(--marigold)/0.5)] bg-accent/50")}>
                <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.isRead ? "bg-border" : "bg-[hsl(var(--marigold))]")} />
                <div className="min-w-0 flex-1"><p className="font-medium">{n.title}</p><p className="text-sm text-muted-foreground">{n.body}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p></div>
                {!n.isRead && (
                  <Button size="sm" variant="ghost" disabled={markRead.isPending && markRead.variables === n.id} onClick={() => markRead.mutate(n.id)} data-testid={`button-mark-read-${n.id}`}>
                    <CheckCheck className="mr-1 h-4 w-4" /> Mark read
                  </Button>
                )}
              </li>))}</ul>}
      </Panel>
    </div>
  );
}
