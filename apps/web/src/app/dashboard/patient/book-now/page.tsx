"use client";

import { Suspense } from "react";
import { BookingWizard } from "@/components/bookings/booking-wizard";
import { Skeleton } from "@/components/common/panel";

export default function BookNowPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <BookingWizard />
    </Suspense>
  );
}
