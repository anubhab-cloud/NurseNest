import { prisma, type PatientProfile } from "@nursenest/db";

export const patientRepository = {
  findByUserId(userId: string): Promise<PatientProfile | null> {
    return prisma.patientProfile.findUnique({ where: { userId } });
  },

  create(data: {
    userId: string;
    fullName: string;
    dateOfBirth: Date;
    bloodGroup?: string;
    allergies?: string[];
    emergencyContact?: string;
    address?: string;
    lat?: number;
    lng?: number;
  }): Promise<PatientProfile> {
    const { allergies, ...rest } = data;
    return prisma.patientProfile.create({
      data: {
        ...rest,
        allergies: allergies ? allergies.join(",") : "",
      },
    });
  },

  update(userId: string, data: Partial<Omit<PatientProfile, "userId">>): Promise<PatientProfile> {
    return prisma.patientProfile.update({ where: { userId }, data });
  },
};
