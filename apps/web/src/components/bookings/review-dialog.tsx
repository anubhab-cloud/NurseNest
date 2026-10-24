"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, X } from "lucide-react";
import type { BookingDto, ReviewDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ErrorNote } from "@/components/common/panel";
import { cn } from "@/lib/utils";

export function ReviewDialog({ booking }: { booking: BookingDto }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  const submit = useMutation({
    mutationFn: () => apiFetch<ReviewDto>(`/api/v1/bookings/${booking.id}/review`, { method: "POST", body: JSON.stringify({ rating, comment: comment.trim() || undefined }) }),
    onSuccess: () => {
      setDone(true);
      void qc.invalidateQueries({ queryKey: ["patient-bookings"] });
      if (booking.nurseId) void qc.invalidateQueries({ queryKey: ["nurse-reviews", booking.nurseId] });
      void qc.invalidateQueries({ queryKey: ["nurses-available"] });
    },
  });
  const conflict = submit.isError && /already|exist|conflict/i.test(submit.error.message);

  if (done) return <span className="text-xs text-[hsl(var(--sage))]">Review submitted</span>;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild><Button size="sm" variant="outline" data-testid={`button-review-${booking.id}`}>Leave review</Button></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-card p-6 shadow-2xl">
          <div className="flex items-start justify-between">
            <div><p className="eyebrow">Completed visit</p><Dialog.Title className="text-2xl font-medium">Rate your visit</Dialog.Title></div>
            <Dialog.Close aria-label="Close"><X className="h-5 w-5" /></Dialog.Close>
          </div>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">{booking.service?.name ?? "Visit"}{booking.nurse ? ` with ${booking.nurse.fullName}` : ""}. Your rating appears on the nurse&apos;s public profile.</Dialog.Description>
          <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); if (rating >= 1) submit.mutate(); }}>
            <div className="flex gap-1" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} data-testid={`button-star-${n}`}
                  onMouseEnter={() => setHover(n)} onClick={() => setRating(n)} className="p-1">
                  <Star className={cn("h-8 w-8 transition", n <= (hover || rating) ? "fill-[hsl(var(--marigold))] text-[hsl(var(--marigold))]" : "text-border")} />
                </button>))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} placeholder="What went well, or what could be better (optional)"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-testid="input-review-comment" />
            {submit.isError && <ErrorNote message={conflict ? "You have already reviewed this visit." : submit.error.message} />}
            <Button type="submit" className="w-full rounded-full" disabled={rating < 1 || submit.isPending || conflict} data-testid="button-submit-review">
              {submit.isPending ? "Submitting" : rating < 1 ? "Choose a rating" : "Submit review"}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
