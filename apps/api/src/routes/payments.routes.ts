import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow, NotFoundError, ForbiddenError, ValidationError } from "@nursenest/utils";
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

    if (!env.razorpayKeyId || !env.razorpayKeySecret) {
      const mockOrderId = `order_mock_${bookingId}`;
      await invoiceRepository.updatePayment(bookingId, { razorpayOrderId: mockOrderId });
      return reply.send(
        apiSuccess({
          orderId: mockOrderId,
          amount: invoice.amount,
          currency: "INR",
          keyId: env.razorpayKeyId || "mock_key",
        }),
      );
    }

    const client = createRazorpayClient({
      keyId: env.razorpayKeyId,
      keySecret: env.razorpayKeySecret,
    });
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

    if (env.razorpayKeySecret) {
      const valid = verifyRazorpaySignature(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature,
        env.razorpayKeySecret,
      );
      if (!valid) throw new ValidationError("Invalid payment signature");
    }

    const invoice = await invoiceRepository.updatePayment(body.bookingId, {
      status: "PAID",
      paidAt: new Date(),
      razorpayOrderId: body.razorpay_order_id,
    });

    return reply.send(apiSuccess(toInvoice(invoice)));
  });
}
