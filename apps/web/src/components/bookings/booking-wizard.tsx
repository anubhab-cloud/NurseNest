"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCircle2, Clock, Loader2, ShieldAlert } from "lucide-react";
import type { BookingDto, NurseProfileDto, PaymentOrderDto, ServiceDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { loadRazorpay, type RazorpayResponse } from "@/lib/razorpay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const steps = ["Service", "Nurse", "Time", "Payment"];

function minLocal() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  d.setSeconds(0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

type PayState = { kind: "idle" } | { kind: "working"; label: string } | { kind: "paid" } | { kind: "error"; message: string };

export function BookingWizard() {
  const params = useSearchParams();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(params.get("serviceId") ?? "");
  const [nurseId, setNurseId] = useState(params.get("nurseId") ?? "");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [timeError, setTimeError] = useState("");
  const [booking, setBooking] = useState<BookingDto | null>(null);
  const [pay, setPay] = useState<PayState>({ kind: "idle" });

  const servicesQ = useQuery({ queryKey: ["services"], queryFn: () => apiFetch<ServiceDto[]>("/api/v1/services") });
  const nursesQ = useQuery({ queryKey: ["nurses-available"], queryFn: () => apiFetch<NurseProfileDto[]>("/api/v1/nurses/available") });
  const service = useMemo(() => servicesQ.data?.find((s) => s.id === serviceId), [servicesQ.data, serviceId]);
  const nurse = useMemo(() => nursesQ.data?.find((n) => n.userId === nurseId), [nursesQ.data, nurseId]);

  useEffect(() => {
    if (step === 0 && params.get("serviceId") && service) setStep(params.get("nurseId") ? 2 : 1);
    // only on first resolve of preselected service
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const create = useMutation({
    mutationFn: () => apiFetch<BookingDto>("/api/v1/bookings", {
      method: "POST",
      body: JSON.stringify({ serviceId, nurseId: nurse ? nurseId : undefined, scheduledAt: new Date(scheduledAt).toISOString(), notes: notes.trim() || undefined }),
    }),
    onSuccess: (b) => { setBooking(b); setStep(3); void qc.invalidateQueries({ queryKey: ["patient-bookings"] }); },
  });

  function submitTime() {
    if (!scheduledAt) return setTimeError("Choose a date and time.");
    const d = new Date(scheduledAt);
    if (Number.isNaN(d.getTime())) return setTimeError("That date is not valid.");
    if (d.getTime() < Date.now() + 30 * 60 * 1000) return setTimeError("Choose a time at least an hour from now.");
    setTimeError("");
    create.mutate();
  }

  async function startPayment() {
    if (!booking) return;
    setPay({ kind: "working", label: "Preparing secure checkout" });
    let order: PaymentOrderDto;
    try {
      order = await apiFetch<PaymentOrderDto>("/api/v1/payments/create-order", { method: "POST", body: JSON.stringify({ bookingId: booking.id }) });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setPay({ kind: "error", message: msg ? `Payment could not be started: ${msg}` : "Online payment is not available right now." });
      return;
    }
    try {
      await loadRazorpay();
    } catch (e) {
      setPay({ kind: "error", message: e instanceof Error ? e.message : "Checkout failed to load." });
      return;
    }
    if (!window.Razorpay || !order.keyId) {
      setPay({ kind: "error", message: "Online payment is not configured." });
      return;
    }
    const bookingId = booking.id;
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "NurseNest",
      description: service?.name ?? "Home nursing visit",
      theme: { color: "#2b3373" },
      handler: async (resp: RazorpayResponse) => {
        setPay({ kind: "working", label: "Verifying payment" });
        try {
          await apiFetch("/api/v1/payments/verify", { method: "POST", body: JSON.stringify({ bookingId, ...resp }) });
          setPay({ kind: "paid" });
          void qc.invalidateQueries({ queryKey: ["patient-bookings"] });
        } catch (e) {
          setPay({ kind: "error", message: `Payment verification failed: ${e instanceof Error ? e.message : "unknown error"}. If money was debited, contact us with your booking reference.` });
        }
      },
      modal: { ondismiss: () => setPay((p) => (p.kind === "working" && p.label.startsWith("Waiting") ? { kind: "idle" } : p)) },
    });
    rzp.on("payment.failed", (r) => setPay({ kind: "error", message: r.error?.description ?? "Payment failed." }));
    setPay({ kind: "working", label: "Waiting for checkout" });
    rzp.open();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Panel eyebrow={`Step ${step + 1} of 4`} title={["Choose a service", "Choose a nurse", "Pick a time", "Pay for the visit"][step]}>
        <ol className="mb-6 flex gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex-1">
              <button disabled={i > step || !!booking} onClick={() => setStep(i)} className="w-full text-left">
                <span className={cn("block h-1.5 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
                <span className="mt-1.5 block text-xs text-muted-foreground">{s}</span>
              </button>
            </li>
          ))}
        </ol>

        {step === 0 && (servicesQ.isLoading ? <div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
          : servicesQ.isError ? <ErrorNote message={servicesQ.error.message} onRetry={() => void servicesQ.refetch()} />
          : <div className="grid gap-3 sm:grid-cols-2">{(servicesQ.data ?? []).map((s) => (
              <button key={s.id} data-testid={`button-service-${s.id}`} onClick={() => { setServiceId(s.id); setStep(1); }}
                className={cn("rounded-2xl border p-4 text-left transition hover:border-primary", serviceId === s.id && "border-primary bg-accent")}>
                <p className="font-medium">{s.name}</p>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {s.durationMinutes} min &middot; {formatCurrency(s.pricePerVisit)}</p>
              </button>))}</div>)}

        {step === 1 && (nursesQ.isLoading ? <Skeleton className="h-40" />
          : nursesQ.isError ? <ErrorNote message={nursesQ.error.message} onRetry={() => void nursesQ.refetch()} />
          : <div className="space-y-3">
              <button onClick={() => { setNurseId(""); setStep(2); }} className={cn("w-full rounded-2xl border border-dashed p-4 text-left hover:border-primary", !nurseId && "border-primary bg-accent")}>
                <p className="font-medium">No preference</p><p className="text-xs text-muted-foreground">The care team will assign an available nurse.</p>
              </button>
              {(nursesQ.data ?? []).map((n) => (
                <button key={n.userId} data-testid={`button-nurse-${n.userId}`} onClick={() => { setNurseId(n.userId); setStep(2); }}
                  className={cn("w-full rounded-2xl border p-4 text-left hover:border-primary", nurseId === n.userId && "border-primary bg-accent")}>
                  <p className="font-medium">{n.fullName}</p>
                  <p className="text-xs text-muted-foreground">{n.specializations.join(", ") || "General care"} &middot; {n.yearsExp} yrs &middot; rating {n.rating.toFixed(1)}</p>
                </button>))}
            </div>)}

        {step === 2 && (
          <div className="max-w-md space-y-4">
            <div className="space-y-2">
              <Label htmlFor="when">Date and time</Label>
              <Input id="when" type="datetime-local" min={minLocal()} value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} data-testid="input-scheduled-at" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes for the nurse (optional)</Label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500}
                className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            {timeError && <ErrorNote message={timeError} />}
            {create.isError && <ErrorNote message={create.error.message} />}
            <Button onClick={submitTime} disabled={create.isPending} className="rounded-full" data-testid="button-create-booking">
              {create.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving booking</> : "Save booking and continue"}
            </Button>
          </div>
        )}

        {step === 3 && booking && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-2xl bg-[hsl(var(--sage)/0.12)] p-4 text-sm"><Check className="h-4 w-4 text-[hsl(var(--sage))]" /> Booking saved for {formatDate(booking.scheduledAt)}. It is pending until paid and confirmed.</div>
            {pay.kind === "paid" ? (
              <div className="rounded-2xl border p-6 text-center" data-testid="status-payment-paid">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[hsl(var(--sage))]" />
                <p className="mt-3 text-lg font-medium">Payment verified</p>
                <Button asChild className="mt-4 rounded-full"><Link href="/dashboard/patient/bookings">View bookings</Link></Button>
              </div>
            ) : (
              <>
                {pay.kind === "error" && (
                  <div className="space-y-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm" role="alert">
                    <p className="flex items-center gap-2 font-medium text-destructive"><ShieldAlert className="h-4 w-4" /> {pay.message}</p>
                    <p className="text-muted-foreground">Your booking is saved. You can retry or find it in <Link href="/dashboard/patient/bookings" className="underline">My bookings</Link>.</p>
                  </div>
                )}
                <Button onClick={() => void startPayment()} disabled={pay.kind === "working"} size="lg" className="rounded-full" data-testid="button-pay">
                  {pay.kind === "working" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {pay.label}</> : `Pay ${formatCurrency(booking.totalAmount)} with Razorpay`}
                </Button>
              </>
            )}
          </div>
        )}
      </Panel>

      <aside className="h-fit rounded-3xl border bg-accent/60 p-6">
        <p className="eyebrow">Summary</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="text-muted-foreground">Service</dt><dd className="font-medium">{service?.name ?? "Not chosen"}</dd></div>
          <div><dt className="text-muted-foreground">Nurse</dt><dd className="font-medium">{nurse?.fullName ?? "No preference"}</dd></div>
          <div><dt className="text-muted-foreground">When</dt><dd className="font-medium">{scheduledAt ? formatDate(new Date(scheduledAt).toISOString()) : "Not chosen"}</dd></div>
        </dl>
        <p className="mt-6 border-t pt-4 font-display text-3xl">{service ? formatCurrency(booking?.totalAmount ?? service.pricePerVisit) : "—"}</p>
      </aside>
    </div>
  );
}
