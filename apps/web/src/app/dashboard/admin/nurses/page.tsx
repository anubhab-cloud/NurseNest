"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCheck } from "lucide-react";
import type { NurseProfileDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/utils";

type ReviewNurse = NurseProfileDto & { isVerified?: boolean };

export default function AdminNursesPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-nurses"], queryFn: () => apiFetch<ReviewNurse[]>("/api/v1/admin/nurses") });
  const verify = useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) => apiFetch(`/api/v1/admin/nurses/${id}/verify`, { method: "PATCH", body: JSON.stringify({ isVerified }) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["admin-nurses"] }); void qc.invalidateQueries({ queryKey: ["nurses-available"] }); void qc.invalidateQueries({ queryKey: ["admin-stats"] }); },
  });
  const list = [...(q.data ?? [])].sort((a, b) => Number(!!a.isVerified) - Number(!!b.isVerified));
  const pending = list.filter((n) => !n.isVerified).length;

  return (
    <Panel eyebrow={q.data ? `${pending} awaiting review` : "Onboarding"} title="Nurse credentials">
      <p className="mb-5 text-sm text-muted-foreground">Check each certification number against the issuing nursing council before verifying. Unverified nurses cannot accept new visits.</p>
      {verify.isError && <div className="mb-3"><ErrorNote message={verify.error.message} /></div>}
      {q.isLoading ? <Skeleton className="h-64" /> : q.isError ? <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />
        : list.length === 0 ? <EmptyState icon={UserCheck} title="No nurses registered" body="Nurse registrations appear here for credential review." />
        : <ul className="divide-y">{list.map((n) => {
            const busy = verify.isPending && verify.variables?.id === n.userId;
            return (
              <li key={n.userId} data-testid={`row-nurse-review-${n.userId}`} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-medium">{n.fullName}</p>
                  <p className="text-xs text-muted-foreground">Cert. {n.certificationNumber} &middot; {n.yearsExp} yrs &middot; {n.specializations.join(", ") || "General care"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase", n.isVerified ? "bg-[hsl(var(--sage)/0.15)] text-[hsl(var(--sage))]" : "bg-accent text-accent-foreground")}>{n.isVerified ? "Verified" : "Pending review"}</span>
                  {n.isVerified
                    ? <Button size="sm" variant="ghost" disabled={busy} onClick={() => { if (confirm(`Revoke verification for ${n.fullName}?`)) verify.mutate({ id: n.userId, isVerified: false }); }}>Revoke</Button>
                    : <Button size="sm" disabled={busy} onClick={() => verify.mutate({ id: n.userId, isVerified: true })}>Verify</Button>}
                </div>
              </li>);
          })}</ul>}
    </Panel>
  );
}
