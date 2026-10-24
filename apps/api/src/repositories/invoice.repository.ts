import { prisma, type Invoice, type InvoiceStatus } from "@nursenest/db";

export const invoiceRepository = {
  findByBooking(bookingId: string): Promise<Invoice | null> {
    return prisma.invoice.findUnique({ where: { bookingId } });
  },
  findByOrder(razorpayOrderId: string) {
    return prisma.invoice.findUnique({ where: { razorpayOrderId } });
  },
  async capture(bookingId: string, orderId: string, paymentId: string) {
    return prisma.$transaction(async tx => {
      await tx.invoice.updateMany({
        where: { bookingId, razorpayOrderId: orderId, status: "PENDING" },
        data: { status: "PAID", paidAt: new Date(), razorpayPaymentId: paymentId },
      });
      return tx.invoice.findUniqueOrThrow({ where: { bookingId } });
    });
  },
  findByPatient(patientId: string) {
    return prisma.invoice.findMany({ where: { booking: { patientId } }, orderBy: { createdAt: "desc" } });
  },

  findByNurse(nurseId: string): Promise<Invoice[]> {
    return prisma.invoice.findMany({
      where: { booking: { nurseId } },
      include: { booking: true },
      orderBy: { createdAt: "desc" },
    });
  },

  create(bookingId: string, amount: number): Promise<Invoice> {
    return prisma.invoice.create({ data: { bookingId, amount } });
  },

  updatePayment(
    bookingId: string,
    data: { razorpayOrderId?: string; razorpayPaymentId?: string; status?: InvoiceStatus; paidAt?: Date },
  ): Promise<Invoice> {
    return prisma.invoice.update({ where: { bookingId }, data });
  },

  totalRevenue(): Promise<number> {
    return prisma.invoice
      .aggregate({ where: { status: "PAID" }, _sum: { amount: true } })
      .then((r) => r._sum.amount ?? 0);
  },
};
