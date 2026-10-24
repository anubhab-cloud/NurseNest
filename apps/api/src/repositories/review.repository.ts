import { prisma, type Review } from "@nursenest/db";

export const reviewRepository = {
  findByNurse(nurseId: string): Promise<Review[]> {
    return prisma.review.findMany({
      where: { nurseId },
      orderBy: { createdAt: "desc" },
    });
  },

  create(data: {
    patientId: string;
    nurseId: string;
    bookingId: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    return prisma.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${data.nurseId}))`;
      const review = await tx.review.create({ data });
      const ratings = await tx.review.aggregate({ where: { nurseId: data.nurseId }, _avg: { rating: true } });
      await tx.nurseProfile.update({ where: { userId: data.nurseId }, data: { rating: ratings._avg.rating || 0 } });
      return review;
    });
  },
};
