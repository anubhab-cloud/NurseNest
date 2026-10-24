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
import { StatusPill } from "@/components/bookings/status";
import { ChatDrawer } from "@/components/chat/chat-drawer";
import { cn, formatDate } from "@/lib/utils";

export default function NurseSchedulePage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const q = useQuery({ queryKey: ["nurse-bookings"], queryFn: () => apiFetch<BookingDto[]>("/api/v1/nurse/me/bookings") });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      apiFetch<BookingDto>(`/api/v1/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["nurse-bookings"] }); void qc.invalidateQueries({ queryKey: ["nurse-invoices"] }); },
  });

  const list = [...(q.data ?? [])].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const current = list.find((b) => b.id === selected) ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <Panel eyebrow="Assigned to you" title="Schedule">
        {update.isError && <div className="mb-3"><ErrorNote message={update.error.message} /></div>}
        {q.isLoading ? <div className="space-y-3"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
          : q.isError ? <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />
          : list.length === 0 ? <EmptyState icon={CalendarX} title="No visits assigned" body="Visits assigned to you will appear here." />
          : <ul className="space-y-2">{list.map((b) => {
              const busy = update.isPending && update.variables?.id === b.id;
              return (
                <li key={b.id} data-testid={`row-visit-${b.id}`} onClick={() => setSelected(b.id)}
                  className={cn("cursor-pointer rounded-2xl border p-4 transition", selected === b.id ? "border-primary bg-accent" : "hover:bg-accent/50")}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{b.patient?.fullName ?? "Patient"} <span className="font-normal text-muted-foreground">&middot; {b.service?.name ?? "Visit"}</span></p>
                      <p className="text-xs text-muted-foreground">{formatDate(b.scheduledAt)}{b.patient?.address ? ` · ${b.patient.address}` : ""}</p>
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    {b.status === "PENDING" && <Button size="sm" disabled={busy} onClick={() => update.mutate({ id: b.id, status: "CONFIRMED" })}>Confirm</Button>}
                    {b.status === "CONFIRMED" && <Button size="sm" disabled={busy} onClick={() => update.mutate({ id: b.id, status: "IN_PROGRESS" })}>Start visit</Button>}
                    {b.status === "IN_PROGRESS" && <>
                      <Button size="sm" variant="outline" asChild><Link href="/dashboard/nurse/vitals/log">Log vitals</Link></Button>
                      <Button size="sm" asChild><Link href={`/dashboard/nurse/notes/${b.id}`}>Write note and complete</Link></Button>
                    </>}
                    <Button size="sm" variant="ghost" asChild><Link href={`/dashboard/nurse/patient/${b.patientId}`}>Patient record</Link></Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelected(b.id)}>Messages</Button>
                  </div>
                </li>);
            })}</ul>}
      </Panel>
      <div className="xl:sticky xl:top-24 xl:h-fit">
        {current ? <ChatDrawer key={current.id} bookingId={current.id} title={`${current.patient?.fullName ?? "Patient"} · ${formatDate(current.scheduledAt)}`} />
          : <div className="rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground">Select a visit to see its message thread.</div>}
      </div>
    </div>
  );
}
