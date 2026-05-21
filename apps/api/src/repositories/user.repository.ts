import { prisma, type Role, type User } from "@nursenest/db";

export const userRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: {
    email: string;
    passwordHash: string;
    role: Role;
    phone?: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  },

  updateActive(id: string, isActive: boolean): Promise<User> {
    return prisma.user.update({ where: { id }, data: { isActive } });
  },

  listAll(params: { role?: Role; search?: string; page: number; limit: number }) {
    const where = {
      ...(params.role ? { role: params.role } : {}),
      ...(params.search
        ? { email: { contains: params.search, mode: "insensitive" as const } }
        : {}),
    };
    return prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { createdAt: "desc" },
        include: { patientProfile: true, nurseProfile: true },
      }),
    ]);
  },

  countByRole(role: Role): Promise<number> {
    return prisma.user.count({ where: { role, isActive: true } });
  },

  updatePassword(id: string, passwordHash: string): Promise<User> {
    return prisma.user.update({ where: { id }, data: { passwordHash } });
  },
};
