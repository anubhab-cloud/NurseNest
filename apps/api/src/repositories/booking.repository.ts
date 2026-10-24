import { prisma, type Booking, type BookingStatus } from "@nursenest/db";
import { ConflictError, ValidationError } from "@nursenest/utils";
import { assertTransition } from "../lib/booking-policy.js";

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
    return prisma.$transaction(async tx => {
      if (data.nurseId) {
        // Serialize scheduling changes per nurse so concurrent requests cannot double-book.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${data.nurseId}))`;
        const nurse = await tx.nurseProfile.findUnique({ where: { userId: data.nurseId }, include: { user: true } });
        if (!nurse?.isAvailable || !nurse.isVerified || !nurse.user.isActive) throw new ValidationError("This nurse is not available.");
        const service = await tx.service.findUniqueOrThrow({ where: { id: data.serviceId } });
        const end = new Date(data.scheduledAt.getTime() + service.durationMinutes * 60000);
        const others = await tx.booking.findMany({ where: { nurseId: data.nurseId, status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] }, scheduledAt: { lt: end } }, include: { service: true } });
        if (others.some(b => b.scheduledAt.getTime() + b.service.durationMinutes * 60000 > data.scheduledAt.getTime())) throw new ConflictError("This nurse already has a visit at that time. Choose another time or nurse.");
      }
      return tx.booking.create({
        data: { ...data, status: "PENDING", invoice: { create: { amount: data.totalAmount } } },
        include: bookingInclude,
      });
    });
  },

  updateStatus(id: string, status: BookingStatus, expected: BookingStatus) {
    return prisma.$transaction(async tx => {
      const changed = await tx.booking.updateMany({ where: { id, status: expected }, data: { status } });
      if (changed.count !== 1) throw new ConflictError("Booking changed. Refresh and try again.");
      if (status === "COMPLETED") {
        const completed = await tx.booking.findUniqueOrThrow({ where: { id }, select: { nurseId: true } });
        if (completed.nurseId) await tx.nurseProfile.update({ where: { userId: completed.nurseId }, data: { totalVisits: { increment: 1 } } });
      }
      return tx.booking.findUniqueOrThrow({ where: { id }, include: bookingInclude });
    });
  },
  assign(id: string, nurseId: string) {
    return prisma.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${nurseId}))`;
      const booking = await tx.booking.findUniqueOrThrow({ where: { id }, include: { service: true } });
      if (!["PENDING", "CONFIRMED"].includes(booking.status)) throw new ConflictError("Only pending or confirmed bookings can be assigned.");
      const nurse = await tx.nurseProfile.findUnique({ where: { userId: nurseId }, include: { user: true } });
      if (!nurse?.isAvailable || !nurse.isVerified || !nurse.user.isActive) throw new ValidationError("Nurse is not available.");
      const end = new Date(booking.scheduledAt.getTime() + booking.service.durationMinutes * 60000);
      const overlaps = await tx.booking.findMany({ where: { id: { not: id }, nurseId, status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] }, scheduledAt: { lt: end } }, include: { service: true } });
      if (overlaps.some(b => b.scheduledAt.getTime() + b.service.durationMinutes * 60000 > booking.scheduledAt.getTime())) throw new ConflictError("Nurse has an overlapping visit.");
      return tx.booking.update({ where: { id }, data: { nurseId }, include: bookingInclude });
    });
  },

  cancel(id: string, expected: BookingStatus) {
    assertTransition(expected, "CANCELLED");
    return this.updateStatus(id, "CANCELLED", expected);
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
  async patientHasActiveNurse(patientId: string, nurseId: string): Promise<boolean> {
    return (await prisma.booking.count({
      where: { patientId, nurseId, status: { in: ["CONFIRMED", "IN_PROGRESS"] } },
    })) > 0;
  },
};
