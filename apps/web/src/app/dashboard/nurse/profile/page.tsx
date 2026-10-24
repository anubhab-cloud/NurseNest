"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NurseProfileDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { initials } from "@/components/nurses/stars";
import { cn } from "@/lib/utils";

export default function NurseProfilePage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["nurse-me"], queryFn: () => apiFetch<NurseProfileDto>("/api/v1/nurse/me") });
  const toggle = useMutation({
    mutationFn: (isAvailable: boolean) => apiFetch("/api/v1/nurses/me/availability", { method: "PATCH", body: JSON.stringify({ isAvailable }) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["nurse-me"] }); void qc.invalidateQueries({ queryKey: ["nurses-available"] }); },
  });

  if (q.isLoading) return <Skeleton className="h-72" />;
  if (q.isError || !q.data) return <ErrorNote message={q.error?.message ?? "Profile not found"} onRetry={() => void q.refetch()} />;
  const p = q.data as NurseProfileDto & { isVerified?: boolean };
  const verified = p.isVerified !== false;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Panel>
        <span className="grid h-20 w-20 place-items-center rounded-3xl bg-primary font-display text-2xl text-primary-foreground">{initials(p.fullName)}</span>
        <h2 className="mt-5 text-3xl font-medium">{p.fullName}</h2>
        <p className="text-sm text-muted-foreground">Certification no. {p.certificationNumber}</p>
        <div className="mt-5 flex flex-wrap gap-2">{(p.specializations.length ? p.specializations : ["General care"]).map((s) => <span key={s} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">{s}</span>)}</div>
        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[["Rating", p.rating.toFixed(1)], ["Years", p.yearsExp], ["Visits", p.totalVisits]].map(([k, v]) => <div key={k as string} className="rounded-2xl bg-muted/60 p-3"><dt className="eyebrow">{k}</dt><dd className="font-display text-2xl">{v}</dd></div>)}
        </dl>
      </Panel>
      <Panel eyebrow="Availability" title="Accepting new visits">
        {!verified && <div className="mb-4 rounded-2xl border border-[hsl(var(--marigold)/0.5)] bg-accent p-4 text-sm" data-testid="status-credential-review"><p className="font-medium">Credential review pending</p><p className="mt-1 text-muted-foreground">Our team is checking your certification. You can accept visits once it is verified.</p></div>}
        <p className="text-sm text-muted-foreground">When off, you will not appear in the available nurses list for new bookings.</p>
        <button role="switch" aria-checked={p.isAvailable} disabled={toggle.isPending || !verified} onClick={() => toggle.mutate(!p.isAvailable)} data-testid="switch-availability"
          className={cn("mt-6 flex w-full items-center justify-between rounded-2xl border p-4 transition disabled:cursor-not-allowed disabled:opacity-50", p.isAvailable ? "border-primary bg-accent" : "")}>
          <span className="font-medium">{p.isAvailable ? "Available" : "Unavailable"}</span>
          <span className={cn("relative h-7 w-12 rounded-full transition", p.isAvailable ? "bg-primary" : "bg-muted")}>
            <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-card shadow transition", p.isAvailable ? "left-6" : "left-1")} />
          </span>
        </button>
        {toggle.isError && <div className="mt-3"><ErrorNote message={toggle.error.message} /></div>}
      </Panel>
    </div>
  );
}
