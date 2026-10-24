"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MessagesSquare } from "lucide-react";
import type { BookingDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { ChatDrawer } from "@/components/chat/chat-drawer";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

export default function PatientMessagesPage() {
  const { data: bookings = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["patient-bookings"],
    queryFn: () => apiFetch<BookingDto[]>("/api/v1/patients/me/bookings"),
  });
  const chatable = bookings.filter((b) => b.status !== "CANCELLED");
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => { if (!selected && chatable[0]) setSelected(chatable[0].id); }, [selected, chatable]);
  const current = chatable.find((b) => b.id === selected);

  if (isLoading) return <div className="grid gap-4 md:grid-cols-[280px_1fr]"><div className="h-64 animate-pulse rounded-3xl bg-muted" /><div className="h-96 animate-pulse rounded-3xl bg-muted" /></div>;
  if (isError) return <EmptyState icon={MessagesSquare} title="Could not load bookings" body="Messages are organised by booking."><Button onClick={() => void refetch()}>Retry</Button></EmptyState>;
  if (chatable.length === 0)
    return <EmptyState icon={MessagesSquare} title="No conversations yet" body="Each booking has its own message thread. Book a visit to start one."><Button asChild className="rounded-full"><Link href="/dashboard/patient/book-now">Book a visit</Link></Button></EmptyState>;

  return (
    <div className="grid gap-5 md:grid-cols-[280px_1fr]">
      <div className="space-y-2">
        <p className="eyebrow px-1">Bookings</p>
        {chatable.map((b) => (
          <button key={b.id} onClick={() => setSelected(b.id)} data-testid={`button-thread-${b.id}`}
            className={cn("w-full rounded-2xl border p-4 text-left transition", b.id === selected ? "border-primary bg-accent" : "bg-card hover:bg-accent/60")}>
            <p className="font-medium">{b.service?.name ?? "Visit"}</p>
            <p className="text-xs text-muted-foreground">{formatDate(b.scheduledAt)} &middot; {b.nurse?.fullName ?? "Nurse not yet assigned"}</p>
          </button>
        ))}
      </div>
      {current && <ChatDrawer key={current.id} bookingId={current.id} title={current.service?.name ?? "Visit"} />}
    </div>
  );
}
