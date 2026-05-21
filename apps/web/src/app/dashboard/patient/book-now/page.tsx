"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import type { ServiceDto, NurseProfileDto, BookingDto, PaymentOrderDto, ApiResponse } from "@nursenest/types";
import { formatCurrency } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function BookNowPage() {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState("");
  const [nurseId, setNurseId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [bookingId, setBookingId] = useState("");

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: () => apiFetch<ServiceDto[]>("/api/v1/services"),
  });
  const { data: nurses = [] } = useQuery({
    queryKey: ["nurses"],
    queryFn: () => apiFetch<NurseProfileDto[]>("/api/v1/nurses/available"),
    enabled: step >= 2,
  });

  const createBooking = useMutation({
    mutationFn: () =>
      apiFetch<BookingDto>("/api/v1/bookings", {
        method: "POST",
        body: JSON.stringify({ serviceId, nurseId: nurseId || undefined, scheduledAt }),
      }),
    onSuccess: (b) => {
      setBookingId(b.id);
      setStep(4);
    },
  });

  async function pay() {
    const order = await apiFetch<PaymentOrderDto>("/api/v1/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });

    if (!window.Razorpay || !process.env["NEXT_PUBLIC_RAZORPAY_KEY_ID"]) {
      await fetch("/api/v1/payments/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          razorpay_order_id: order.orderId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: "mock",
        }),
      });
      alert("Booking confirmed (mock payment).");
      return;
    }

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      handler: async (response: Record<string, string>) => {
        await fetch("/api/v1/payments/verify", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, ...response }),
        });
        alert("Payment successful!");
      },
    });
    rzp.open();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Visit — Step {step} of 4</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <div className="grid gap-2">
            {services.map((s) => (
              <Button
                key={s.id}
                variant={serviceId === s.id ? "default" : "outline"}
                onClick={() => {
                  setServiceId(s.id);
                  setStep(2);
                }}
              >
                {s.name} — {formatCurrency(s.pricePerVisit)}
              </Button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-2">
            {nurses.map((n) => (
              <Button
                key={n.userId}
                variant={nurseId === n.userId ? "default" : "outline"}
                onClick={() => {
                  setNurseId(n.userId);
                  setStep(3);
                }}
              >
                {n.fullName} ⭐ {n.rating}
              </Button>
            ))}
            <Button variant="ghost" onClick={() => setStep(3)}>
              Skip — assign later
            </Button>
          </div>
        )}
        {step === 3 && (
          <div>
            <Label>Date & Time</Label>
            <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            <Button className="mt-4" onClick={() => createBooking.mutate()} disabled={!scheduledAt}>
              Continue to payment
            </Button>
          </div>
        )}
        {step === 4 && (
          <Button onClick={() => void pay()}>Pay with Razorpay</Button>
        )}
      </CardContent>
    </Card>
  );
}
