"use client";

import { useQuery } from "@tanstack/react-query";
import { Receipt } from "lucide-react";
import type { InvoiceDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const tone: Record<string, string> = { PAID: "bg-[hsl(var(--sage)/0.15)] text-[hsl(var(--sage))]", PENDING: "bg-accent text-accent-foreground", REFUNDED: "bg-muted text-muted-foreground" };

export default function NurseEarningsPage() {
  const q = useQuery({ queryKey: ["nurse-invoices"], queryFn: () => apiFetch<InvoiceDto[]>("/api/v1/nurse/me/invoices") });
  const invoices = q.data ?? [];
  const sum = (s: string) => invoices.filter((i) => i.status === s).reduce((t, i) => t + i.amount, 0);

  if (q.isLoading) return <div className="space-y-4"><Skeleton className="h-28" /><Skeleton className="h-64" /></div>;
  if (q.isError) return <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Paid", sum("PAID")], ["Awaiting payment", sum("PENDING")], ["Refunded", sum("REFUNDED")]].map(([k, v], i) => (
          <div key={k as string} className={cn("rounded-3xl border p-6", i === 0 ? "bg-primary text-primary-foreground" : "bg-card")}>
            <p className={cn("eyebrow", i === 0 && "!text-[hsl(var(--marigold))]")}>{k}</p>
            <p className="mt-2 font-display text-3xl">{formatCurrency(v as number)}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Amounts reflect invoice totals for your visits as recorded by the platform; payout terms are set by NurseNest.</p>
      <Panel eyebrow={`${invoices.length} invoices`} title="Invoice history">
        {invoices.length === 0 ? <EmptyState icon={Receipt} title="No invoices yet" body="Invoices appear once patients book visits assigned to you." />
          : <ul className="divide-y">{invoices.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div><p className="font-medium">Booking {i.bookingId.slice(0, 8)}</p><p className="text-xs text-muted-foreground">Issued {formatDate(i.createdAt)}{i.paidAt ? ` · paid ${formatDate(i.paidAt)}` : ""}</p></div>
                <div className="flex items-center gap-3"><span className="font-display text-lg">{formatCurrency(i.amount)}</span><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase", tone[i.status])}>{i.status}</span></div>
              </li>))}</ul>}
      </Panel>
    </div>
  );
}
