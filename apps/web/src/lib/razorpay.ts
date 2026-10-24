"use client";

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (resp: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const SRC = "https://checkout.razorpay.com/v1/checkout.js";
let loading: Promise<void> | null = null;

export function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Checkout is only available in the browser."));
  if (window.Razorpay) return Promise.resolve();
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.onload = () => (window.Razorpay ? resolve() : reject(new Error("Payment checkout failed to initialise.")));
      s.onerror = () => { loading = null; reject(new Error("Could not load the payment checkout. Check your connection and try again.")); };
      document.body.appendChild(s);
    });
  }
  return loading;
}
