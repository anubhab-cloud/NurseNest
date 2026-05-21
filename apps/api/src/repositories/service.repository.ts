import { prisma, type Service } from "@nursenest/db";

export const serviceRepository = {
  findAll(): Promise<Service[]> {
    return prisma.service.findMany({ orderBy: { name: "asc" } });
  },

  findById(id: string): Promise<Service | null> {
    return prisma.service.findUnique({ where: { id } });
  },
};
