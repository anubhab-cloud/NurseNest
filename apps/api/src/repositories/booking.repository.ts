import { prisma, type Booking, type BookingStatus } from "@nursenest/db";

const bookingInclude = {
  service: true,
  patient: true,
  nurse: true,
  invoice: true,
} as const;

export const bookingRepository = {
  findById(id: string) {
    return prisma.booking.findUnique({ where: { id }, include: bookingInclude });
  },

  findByPatient(patientId: string) {
    return prisma.booking.findMany({
      where: { patientId },
      include: bookingInclude,
      orderBy: { scheduledAt: "desc" },
    });
  },

  findByNurse(nurseId: string) {
    return prisma.booking.findMany({
      where: { nurseId },
      include: bookingInclude,
      orderBy: { scheduledAt: "desc" },
    });
  },

  findAll(params: { status?: BookingStatus; page: number; limit: number }) {
    const where = params.status ? { status: params.status } : {};
    return prisma.$transaction([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: bookingInclude,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { scheduledAt: "desc" },
      }),
    ]);
  },

  create(data: {
    patientId: string;
    nurseId?: string;
    serviceId: string;
    scheduledAt: Date;
    notes?: string;
    totalAmount: number;
  }) {
    return prisma.booking.create({
      data: { ...data, status: "PENDING" },
      include: bookingInclude,
    });
  },

  updateStatus(id: string, status: BookingStatus) {
    return prisma.booking.update({
      where: { id },
      data: { status },
      include: bookingInclude,
    });
  },

  cancel(id: string) {
    return prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: bookingInclude,
    });
  },

  countAll(): Promise<number> {
    return prisma.booking.count();
  },

  countToday(): Promise<number> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return prisma.booking.count({
      where: { createdAt: { gte: start, lte: end } },
    });
  },

  nurseHasPatientAccess(nurseId: string, patientId: string): Promise<boolean> {
    return prisma.booking
      .count({
        where: {
          nurseId,
          patientId,
          status: { in: ["CONFIRMED", "IN_PROGRESS", "COMPLETED"] },
        },
      })
      .then((c) => c > 0);
  },
};
