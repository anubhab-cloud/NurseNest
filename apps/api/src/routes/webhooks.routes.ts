import type { FastifyInstance } from "fastify";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { AppError, ValidationError, parseOrThrow } from "@nursenest/utils";
import { env } from "../config/env.js";
import { invoiceRepository } from "../repositories/invoice.repository.js";

export async function webhooksRoutes(app: FastifyInstance) {
  // Encapsulated parser preserves the exact bytes used by the provider signature.
  app.removeContentTypeParser("application/json");
  app.addContentTypeParser("application/json", { parseAs: "buffer" }, (_request, body, done) => done(null, body));
  app.post("/razorpay", async request => {
    if (!env.razorpayWebhookSecret) throw new AppError("Payment webhooks are not configured.", 503);
    const signature = request.headers["x-razorpay-signature"];
    const raw = request.body as Buffer;
    if (typeof signature !== "string" || !/^[a-f0-9]{64}$/i.test(signature) || !Buffer.isBuffer(raw)) throw new ValidationError("Invalid webhook signature.");
    const expected = createHmac("sha256", env.razorpayWebhookSecret).update(raw).digest();
    if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) throw new ValidationError("Invalid webhook signature.");
    let event: unknown;
    try { event = JSON.parse(raw.toString("utf8")); } catch { throw new ValidationError("Invalid webhook payload."); }
    const data = parseOrThrow(z.object({
      event: z.string(),
      payload: z.object({
        payment: z.object({ entity: z.object({
          id: z.string(), order_id: z.string(), amount: z.number().int(), currency: z.string(), status: z.string(),
        }) }).optional(),
      }),
    }), event);
    if (data.event === "payment.captured" && data.payload.payment) {
      const payment = data.payload.payment.entity;
      const invoice = await invoiceRepository.findByOrder(payment.order_id);
      if (!invoice) throw new ValidationError("Unknown payment order.");
      if (payment.amount !== invoice.amount || payment.currency !== "INR" || payment.status !== "captured") throw new ValidationError("Payment does not match invoice.");
      await invoiceRepository.capture(invoice.bookingId, payment.order_id, payment.id);
    }
    return apiSuccess({ received: true });
  });
}
