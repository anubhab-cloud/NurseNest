import { prisma, type NurseProfile } from "@nursenest/db";

export const nurseRepository = {
  findByUserId(userId: string): Promise<NurseProfile | null> {
    return prisma.nurseProfile.findUnique({ where: { userId } });
  },

  create(data: {
    userId: string;
    fullName: string;
    certificationNumber: string;
    specializations?: string[];
    yearsExp?: number;
  }): Promise<NurseProfile> {
    const { specializations, ...rest } = data;
    return prisma.nurseProfile.create({
      data: {
        ...rest,
        specializations: specializations ? specializations.join(",") : "",
      },
    });
  },

  update(userId: string, data: Partial<Omit<NurseProfile, "userId">>): Promise<NurseProfile> {
    return prisma.nurseProfile.update({ where: { userId }, data });
  },

  findAvailable(params: {
    lat?: number;
    lng?: number;
    serviceId?: string;
    date?: Date;
  }) {
    return prisma.nurseProfile.findMany({
      where: { isAvailable: true, user: { isActive: true } },
      include: { user: true },
    });
  },

  findById(userId: string) {
    return prisma.nurseProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
  },

  listAll() {
    return prisma.nurseProfile.findMany({
      where: { user: { isActive: true } },
      include: { user: true },
    });
  },

  countActive(): Promise<number> {
    return prisma.nurseProfile.count({
      where: { isAvailable: true, user: { isActive: true } },
    });
  },
};
