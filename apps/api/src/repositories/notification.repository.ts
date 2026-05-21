import { prisma, type Notification } from "@nursenest/db";

export const notificationRepository = {
  findByUser(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },

  create(data: { userId: string; title: string; body: string; type: string }): Promise<Notification> {
    return prisma.notification.create({ data });
  },

  markRead(id: string, userId: string): Promise<Notification> {
    return prisma.notification.update({ where: { id, userId }, data: { isRead: true } });
  },
};
