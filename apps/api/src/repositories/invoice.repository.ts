import { prisma, type Invoice, type InvoiceStatus } from "@nursenest/db";

export const invoiceRepository = {
  findByBooking(bookingId: string): Promise<Invoice | null> {
    return prisma.invoice.findUnique({ where: { bookingId } });
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
    data: { razorpayOrderId?: string; status?: InvoiceStatus; paidAt?: Date },
  ): Promise<Invoice> {
    return prisma.invoice.update({ where: { bookingId }, data });
  },

  totalRevenue(): Promise<number> {
    return prisma.invoice
      .aggregate({ where: { status: "PAID" }, _sum: { amount: true } })
      .then((r) => r._sum.amount ?? 0);
  },
};
