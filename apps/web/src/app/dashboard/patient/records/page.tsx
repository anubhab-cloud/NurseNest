"use client";

import { useQuery } from "@tanstack/react-query";
import { NotebookPen, Receipt } from "lucide-react";
import type { InvoiceDto, VisitNoteDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const tone: Record<string, string> = { PAID: "bg-[hsl(var(--sage)/0.15)] text-[hsl(var(--sage))]", PENDING: "bg-accent text-accent-foreground", REFUNDED: "bg-muted text-muted-foreground" };

export default function PatientRecordsPage() {
  const notesQ = useQuery({ queryKey: ["patient-notes"], queryFn: () => apiFetch<VisitNoteDto[]>("/api/v1/patients/me/notes") });
  const invQ = useQuery({ queryKey: ["patient-invoices"], queryFn: () => apiFetch<InvoiceDto[]>("/api/v1/patients/me/invoices") });
  const notes = [...(notesQ.data ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const invoices = [...(invQ.data ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
      <Panel eyebrow={notesQ.data ? `${notes.length} notes` : "Care record"} title="Visit notes">
        {notesQ.isLoading ? <div className="space-y-3"><Skeleton className="h-28" /><Skeleton className="h-28" /></div>
          : notesQ.isError ? <ErrorNote message={notesQ.error.message} onRetry={() => void notesQ.refetch()} />
          : notes.length === 0 ? <EmptyState icon={NotebookPen} title="No visit notes yet" body="Your nurse writes a note after each completed visit. It will appear here." />
          : <ul className="space-y-3">{notes.map((n) => (
              <li key={n.id} data-testid={`row-note-${n.id}`} className="rounded-2xl border p-5 text-sm">
                <p className="eyebrow">{formatDate(n.createdAt)}</p>
                <p className="mt-2 whitespace-pre-wrap leading-relaxed">{n.observations}</p>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl bg-muted/60 p-3"><dt className="text-xs text-muted-foreground">Medications noted</dt><dd>{n.medications || "None noted"}</dd></div>
                  <div className="rounded-xl bg-muted/60 p-3"><dt className="text-xs text-muted-foreground">Suggested next visit</dt><dd>{n.nextVisitDate ? new Date(n.nextVisitDate).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Not set"}</dd></div>
                </dl>
              </li>))}</ul>}
        <p className="mt-4 text-xs text-muted-foreground">Notes are a record of the visit, not a prescription. Follow your doctor&apos;s advice on medication.</p>
      </Panel>
      <Panel eyebrow={invQ.data ? `${invoices.length} invoices` : "Billing"} title="Invoices">
        {invQ.isLoading ? <Skeleton className="h-48" />
          : invQ.isError ? <ErrorNote message={invQ.error.message} onRetry={() => void invQ.refetch()} />
          : invoices.length === 0 ? <EmptyState icon={Receipt} title="No invoices yet" body="An invoice is created for each booking." />
          : <ul className="divide-y">{invoices.map((i) => (
              <li key={i.id} data-testid={`row-invoice-${i.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div><p className="font-medium">Booking {i.bookingId.slice(0, 8)}</p><p className="text-xs text-muted-foreground">{formatDate(i.createdAt)}{i.paidAt ? ` · paid ${formatDate(i.paidAt)}` : ""}</p></div>
                <div className="flex items-center gap-3"><span className="font-display text-lg">{formatCurrency(i.amount)}</span><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase", tone[i.status])}>{i.status}</span></div>
              </li>))}</ul>}
      </Panel>
    </div>
  );
}
