import { prisma, type VitalRecord } from "@nursenest/db";

export const vitalRepository = {
  create(data: {
    patientId: string;
    nurseId: string;
    heartRate: number;
    systolic: number;
    diastolic: number;
    spo2: number;
    temperature: number;
  }): Promise<VitalRecord> {
    return prisma.vitalRecord.create({ data });
  },

  findByPatient(patientId: string, from?: Date, to?: Date, page = 1, limit = 20) {
    const where = {
      patientId,
      ...(from || to
        ? {
            recordedAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };
    return prisma.$transaction([
      prisma.vitalRecord.count({ where }),
      prisma.vitalRecord.findMany({
        where,
        orderBy: { recordedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
  },
};
