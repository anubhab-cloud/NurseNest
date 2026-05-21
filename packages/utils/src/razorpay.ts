import Razorpay from "razorpay";
import crypto from "node:crypto";

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

export function createRazorpayClient(config: RazorpayConfig): Razorpay {
  return new Razorpay({
    key_id: config.keyId,
    key_secret: config.keySecret,
  });
}

export async function createRazorpayOrder(
  client: Razorpay,
  amountPaise: number,
  receipt: string,
): Promise<{ id: string; amount: number; currency: string }> {
  const order = await client.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
  });
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}
