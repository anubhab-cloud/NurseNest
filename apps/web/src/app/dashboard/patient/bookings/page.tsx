"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarX } from "lucide-react";
import type { BookingDto, BookingStatus } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { ReviewDialog } from "@/components/bookings/review-dialog";
import { StatusPill } from "@/components/bookings/status";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const filters: ("ALL" | BookingStatus)[] = ["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function PatientBookingsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("ALL");
  const qc = useQueryClient();
  const cancel = useMutation({
    mutationFn: (id: string) => apiFetch<unknown>(`/api/v1/bookings/${id}`, { method: "DELETE" }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["patient-bookings"] }); void qc.invalidateQueries({ queryKey: ["patient-notifications"] }); },
  });
  const canCancel = (b: BookingDto) => (b.status === "PENDING" || b.status === "CONFIRMED") && new Date(b.scheduledAt).getTime() - Date.now() >= 2 * 60 * 60 * 1000;
  const q = useQuery({ queryKey: ["patient-bookings"], queryFn: () => apiFetch<BookingDto[]>("/api/v1/patients/me/bookings") });
  const list = (q.data ?? []).filter((b) => filter === "ALL" || b.status === filter).sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));

  return (
    <Panel eyebrow="History" title="My bookings" action={<Button asChild size="sm" className="rounded-full"><Link href="/dashboard/patient/book-now">New booking</Link></Button>}>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium", filter === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent")}>
            {s === "ALL" ? "All" : s.replace("_", " ").toLowerCase()}
          </button>
        ))}
      </div>
      {cancel.isError && <div className="mb-3"><ErrorNote message={`Could not cancel: ${cancel.error.message}`} /></div>}
      {q.isLoading ? <div className="space-y-3"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
        : q.isError ? <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />
        : list.length === 0 ? <EmptyState icon={CalendarX} title="No bookings here" body="Bookings you make will be listed with their status." />
        : <ul className="divide-y">{list.map((b) => (
            <li key={b.id} data-testid={`row-booking-${b.id}`} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-medium">{b.service?.name ?? "Visit"}</p>
                <p className="text-sm text-muted-foreground">{formatDate(b.scheduledAt)} &middot; {b.nurse?.fullName ?? "Nurse to be assigned"}</p>
                {b.notes && <p className="mt-1 text-xs text-muted-foreground">{b.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg">{formatCurrency(b.totalAmount)}</span>
                <StatusPill status={b.status} />
                {b.status === "COMPLETED" && <ReviewDialog booking={b} />}
                {canCancel(b) && (
                  <Button size="sm" variant="outline" disabled={cancel.isPending && cancel.variables === b.id} data-testid={`button-cancel-${b.id}`}
                    onClick={() => { if (confirm("Cancel this visit? This cannot be undone.")) cancel.mutate(b.id); }}>
                    {cancel.isPending && cancel.variables === b.id ? "Cancelling" : "Cancel"}
                  </Button>)}
                {b.status !== "CANCELLED" && <Button size="sm" variant="ghost" asChild><Link href="/dashboard/patient/messages">Message</Link></Button>}
              </div>
            </li>))}</ul>}
      <p className="mt-6 text-xs text-muted-foreground">Pending or confirmed visits can be cancelled up to 2 hours before the scheduled time. For later changes, <Link href="/contact" className="underline">contact us</Link>.</p>
    </Panel>
  );
}
