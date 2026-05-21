import { prisma, type VisitNote } from "@nursenest/db";

export const visitNoteRepository = {
  findByBooking(bookingId: string): Promise<VisitNote | null> {
    return prisma.visitNote.findUnique({ where: { bookingId } });
  },

  findByPatient(patientId: string): Promise<VisitNote[]> {
    return prisma.visitNote.findMany({
      where: { booking: { patientId } },
      orderBy: { createdAt: "desc" },
    });
  },

  upsert(data: {
    bookingId: string;
    nurseId: string;
    observations: string;
    medications?: string;
    nextVisitDate?: Date;
    attachmentUrls?: string[];
  }): Promise<VisitNote> {
    return prisma.visitNote.upsert({
      where: { bookingId: data.bookingId },
      create: data,
      update: {
        observations: data.observations,
        medications: data.medications,
        nextVisitDate: data.nextVisitDate,
        attachmentUrls: data.attachmentUrls,
      },
    });
  },
};
