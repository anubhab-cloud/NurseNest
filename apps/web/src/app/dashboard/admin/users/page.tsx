"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";
import type { AuthUserDto, PaginatedDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const q = useQuery({ queryKey: ["admin-users", page], queryFn: () => apiFetch<PaginatedDto<AuthUserDto>>(`/api/v1/admin/users?limit=25&page=${page}`) });
  const toggle = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => apiFetch(`/api/v1/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["admin-users"] }); void qc.invalidateQueries({ queryKey: ["admin-stats"] }); },
  });
  const items = q.data?.items ?? [];
  return (
    <Panel eyebrow={q.data ? `${q.data.total} accounts` : "Accounts"} title="Users">
      {toggle.isError && <div className="mb-3"><ErrorNote message={toggle.error.message} /></div>}
      {q.isLoading ? <Skeleton className="h-64" /> : q.isError ? <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />
        : items.length === 0 ? <EmptyState icon={Users} title="No users" body="Registered accounts appear here." />
        : <ul className="divide-y">{items.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div><p className="font-medium">{u.email}</p><p className="text-xs text-muted-foreground">{u.phone ?? "No phone"}</p></div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase text-accent-foreground">{u.role}</span>
                <span className={cn("text-xs", u.isActive ? "text-[hsl(var(--sage))]" : "text-destructive")}>{u.isActive ? "Active" : "Deactivated"}</span>
                {u.role !== "ADMIN" && (
                  <Button size="sm" variant={u.isActive ? "outline" : "default"} disabled={toggle.isPending && toggle.variables?.id === u.id}
                    onClick={() => { if (!u.isActive || confirm(`Deactivate ${u.email}? They will no longer be able to sign in.`)) toggle.mutate({ id: u.id, isActive: !u.isActive }); }}>
                    {u.isActive ? "Deactivate" : "Activate"}
                  </Button>)}
              </div>
            </li>))}</ul>}
      {q.data && q.data.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-muted-foreground">Page {q.data.page} of {q.data.totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= q.data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>)}
    </Panel>
  );
}
