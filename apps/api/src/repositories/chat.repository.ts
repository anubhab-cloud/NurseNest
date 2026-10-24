import { prisma } from "@nursenest/db";

export const chatRepository = {
  async list(bookingId: string) {
    const latest = await prisma.chatMessage.findMany({
      where: { bookingId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 100,
    });
    return latest.reverse();
  },
  create(bookingId: string, senderId: string, body: string) {
    return prisma.chatMessage.create({ data: { bookingId, senderId, body } });
  },
};
