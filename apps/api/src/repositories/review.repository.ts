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
    return prisma.review.create({ data });
  },
};
