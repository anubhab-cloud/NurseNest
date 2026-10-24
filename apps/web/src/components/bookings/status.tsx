import type { BookingStatus } from "@nursenest/types";
import { cn } from "@/lib/utils";

const styles: Record<BookingStatus, string> = {
  PENDING: "bg-accent text-accent-foreground",
  CONFIRMED: "bg-primary/10 text-primary",
  IN_PROGRESS: "bg-[hsl(var(--marigold)/0.2)] text-foreground",
  COMPLETED: "bg-[hsl(var(--sage)/0.15)] text-[hsl(var(--sage))]",
  CANCELLED: "bg-muted text-muted-foreground line-through",
};

const labels: Record<BookingStatus, string> = {
  PENDING: "Pending", CONFIRMED: "Confirmed", IN_PROGRESS: "In progress", COMPLETED: "Completed", CANCELLED: "Cancelled",
};

/** Allowed forward transitions. Terminal states have none. */
export const transitions: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const actionLabel: Record<BookingStatus, string> = {
  PENDING: "Pending", CONFIRMED: "Confirm", IN_PROGRESS: "Start visit", COMPLETED: "Mark completed", CANCELLED: "Cancel",
};

export function StatusPill({ status }: { status: BookingStatus }) {
  return (
    <span data-testid="status-booking" className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider", styles[status])}>
      {labels[status]}
    </span>
  );
}
