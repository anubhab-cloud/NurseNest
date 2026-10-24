"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarX } from "lucide-react";
import type { BookingDto, BookingStatus, NurseProfileDto, PaginatedDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { StatusPill, transitions, actionLabel } from "@/components/bookings/status";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminBookingsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const q = useQuery({ queryKey: ["admin-bookings", page], queryFn: () => apiFetch<PaginatedDto<BookingDto>>(`/api/v1/admin/bookings?limit=25&page=${page}`) });
  const nursesQ = useQuery({ queryKey: ["nurses-available"], queryFn: () => apiFetch<NurseProfileDto[]>("/api/v1/nurses/available") });

  const refresh = () => { void qc.invalidateQueries({ queryKey: ["admin-bookings"] }); void qc.invalidateQueries({ queryKey: ["admin-stats"] }); };
  const assign = useMutation({
    mutationFn: ({ id, nurseId }: { id: string; nurseId: string }) => apiFetch<BookingDto>(`/api/v1/admin/bookings/${id}/assign`, { method: "PATCH", body: JSON.stringify({ nurseId }) }),
    onSuccess: () => { refresh(); void qc.invalidateQueries({ queryKey: ["nurses-available"] }); },
  });
  const status = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => apiFetch<BookingDto>(`/api/v1/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: refresh,
  });

  const items = q.data?.items ?? [];
  const nurses = nursesQ.data ?? [];

  return (
    <Panel eyebrow={q.data ? `${q.data.total} total` : "Operations"} title="All bookings">
      {assign.isError && <div className="mb-3"><ErrorNote message={`Assignment failed: ${assign.error.message}`} /></div>}
      {status.isError && <div className="mb-3"><ErrorNote message={`Status change failed: ${status.error.message}`} /></div>}
      {q.isLoading ? <div className="space-y-3"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
        : q.isError ? <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />
        : items.length === 0 ? <EmptyState icon={CalendarX} title="No bookings yet" body="New patient bookings will appear here." />
        : <ul className="divide-y">{items.map((b) => {
            const terminal = transitions[b.status].length === 0;
            const busy = (assign.isPending && assign.variables?.id === b.id) || (status.isPending && status.variables?.id === b.id);
            return (
              <li key={b.id} data-testid={`row-admin-booking-${b.id}`} className="grid gap-3 py-4 lg:grid-cols-[1.3fr_1fr_auto] lg:items-center">
                <div>
                  <p className="font-medium">{b.service?.name ?? "Visit"} <span className="font-normal text-muted-foreground">&middot; {b.patient?.fullName ?? "Patient"}</span></p>
                  <p className="text-xs text-muted-foreground">{formatDate(b.scheduledAt)} &middot; {formatCurrency(b.totalAmount)}</p>
                </div>
                <div>
                  {terminal ? <p className="text-sm">{b.nurse?.fullName ?? "Unassigned"}</p> : (
                    <select aria-label="Assign nurse" disabled={busy || nursesQ.isLoading} value={b.nurseId ?? ""} data-testid={`select-assign-${b.id}`}
                      onChange={(e) => e.target.value && assign.mutate({ id: b.id, nurseId: e.target.value })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm">
                      <option value="">{b.nurse?.fullName ?? "Assign a nurse"}</option>
                      {nurses.filter((n) => n.userId !== b.nurseId).map((n) => <option key={n.userId} value={n.userId}>{n.fullName}</option>)}
                      {b.nurseId && <option value={b.nurseId}>{b.nurse?.fullName ?? "Current nurse"}</option>}
                    </select>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill status={b.status} />
                  {transitions[b.status].map((s) => (
                    <Button key={s} size="sm" variant={s === "CANCELLED" ? "ghost" : "outline"} disabled={busy}
                      onClick={() => { if (s !== "CANCELLED" || confirm("Cancel this booking? This cannot be undone.")) status.mutate({ id: b.id, status: s }); }}>
                      {actionLabel[s]}
                    </Button>
                  ))}
                </div>
              </li>);
          })}</ul>}
      {q.data && q.data.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-muted-foreground">Page {q.data.page} of {q.data.totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= q.data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </Panel>
  );
}
