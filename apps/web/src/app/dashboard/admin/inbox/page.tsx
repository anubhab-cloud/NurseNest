"use client";

import { useQuery } from "@tanstack/react-query";
import { Inbox, Mail } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/utils";

interface ContactMessage { id: string; name: string; email: string; message: string; createdAt: string }

export default function AdminInboxPage() {
  const q = useQuery({ queryKey: ["admin-contact"], queryFn: () => apiFetch<ContactMessage[]>("/api/v1/contact") });
  const items = [...(q.data ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <Panel eyebrow={q.data ? `${items.length} messages` : "Contact form"} title="Inbox">
      {q.isLoading ? <div className="space-y-3"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
        : q.isError ? <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />
        : items.length === 0 ? <EmptyState icon={Inbox} title="Inbox is empty" body="Messages sent from the public contact page appear here." />
        : <ul className="space-y-3">{items.map((m) => (
            <li key={m.id} data-testid={`row-contact-${m.id}`} className="rounded-2xl border p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">{m.name} <span className="font-normal text-muted-foreground">&lt;{m.email}&gt;</span></p>
                <span className="text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{m.message}</p>
              <a href={`mailto:${m.email}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"><Mail className="h-3.5 w-3.5" /> Reply by email</a>
            </li>))}</ul>}
    </Panel>
  );
}
