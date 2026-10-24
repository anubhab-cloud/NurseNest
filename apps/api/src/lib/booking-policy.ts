import { ConflictError, ValidationError } from "@nursenest/utils";
import type { BookingStatus } from "@nursenest/db";

const transitions: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};
export function assertTransition(from: BookingStatus, to: BookingStatus) {
  if (!transitions[from].includes(to)) throw new ConflictError(`Cannot change a ${from.toLowerCase()} booking to ${to.toLowerCase()}.`);
}
export function assertFuture(date: Date) {
  if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) throw new ValidationError("Choose a future appointment time.");
}
