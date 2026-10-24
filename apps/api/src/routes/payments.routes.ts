import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow, NotFoundError, ForbiddenError, ValidationError, AppError, ConflictError } from "@nursenest/utils";
import { createRazorpayClient, createRazorpayOrder, verifyRazorpaySignature } from "@nursenest/utils";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { invoiceRepository } from "../repositories/invoice.repository.js";
import { env } from "../config/env.js";
import { toInvoice } from "../lib/mappers.js";
import { Role } from "@nursenest/db";

export async function paymentsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireRoles(Role.PATIENT, Role.ADMIN));

  app.post("/create-order", async (request, reply) => {
    const { bookingId } = parseOrThrow(z.object({ bookingId: z.string() }), request.body);
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError("Booking not found");
    if (request.user!.role === Role.PATIENT && booking.patientId !== request.user!.sub) {
      throw new ForbiddenError();
    }

    const invoice = await invoiceRepository.findByBooking(bookingId);
    if (!invoice) throw new NotFoundError("Invoice not found");
    if (booking.status === "CANCELLED") throw new ValidationError("Cannot pay for a cancelled booking.");
    if (invoice.status === "PAID") throw new ConflictError("This invoice is already paid.");

    if (!env.razorpayKeyId || !env.razorpayKeySecret) {
      throw new AppError("Online payments are not configured. Your booking is saved; contact the care team to arrange payment.", 503);
    }

    const client = createRazorpayClient({
      keyId: env.razorpayKeyId,
      keySecret: env.razorpayKeySecret,
    });
    if (invoice.razorpayOrderId) {
      const existing = await client.orders.fetch(invoice.razorpayOrderId);
      return reply.send(apiSuccess({ orderId: existing.id, amount: Number(existing.amount), currency: existing.currency, keyId: env.razorpayKeyId }));
    }
    const order = await createRazorpayOrder(client, invoice.amount, bookingId);
    await invoiceRepository.updatePayment(bookingId, { razorpayOrderId: order.id });

    return reply.send(
      apiSuccess({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: env.razorpayKeyId,
      }),
    );
  });

  app.post("/verify", async (request, reply) => {
    const body = parseOrThrow(
      z.object({
        bookingId: z.string(),
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
      }),
      request.body,
    );

    const booking = await bookingRepository.findById(body.bookingId);
    if (!booking) throw new NotFoundError("Booking not found");
    if (request.user!.role === Role.PATIENT && booking.patientId !== request.user!.sub) {
      throw new ForbiddenError();
    }

    if (!env.razorpayKeyId || !env.razorpayKeySecret) throw new AppError("Online payments are not configured.", 503);
    const current = await invoiceRepository.findByBooking(body.bookingId);
    if (!current || current.razorpayOrderId !== body.razorpay_order_id) throw new ValidationError("Payment order does not match this invoice.");
    if (current.status === "PAID") {
      if (current.razorpayPaymentId === body.razorpay_payment_id) return reply.send(apiSuccess(toInvoice(current)));
      throw new ConflictError("Invoice already paid.");
    }
    if (booking.status === "CANCELLED") throw new ValidationError("Booking cancelled. Please contact support about this payment.");
    const valid = verifyRazorpaySignature(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature,
        env.razorpayKeySecret,
      );
    if (!valid) throw new ValidationError("Invalid payment signature");
    const client = createRazorpayClient({ keyId: env.razorpayKeyId, keySecret: env.razorpayKeySecret });
    const payment = await client.payments.fetch(body.razorpay_payment_id);
    if (payment.order_id !== current.razorpayOrderId || Number(payment.amount) !== current.amount ||
      payment.currency !== "INR" || payment.status !== "captured") {
      throw new ValidationError("Payment has not been captured for this invoice.");
    }

    const invoice = await invoiceRepository.capture(body.bookingId, body.razorpay_order_id, body.razorpay_payment_id);

    return reply.send(apiSuccess(toInvoice(invoice)));
  });
}
