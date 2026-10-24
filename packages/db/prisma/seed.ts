import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Catalog only. Never seed accounts, known passwords, clinical records or fake reviews.
const services = [
  { id: "seed-service-elder", name: "Elder Care Visit", description: "In-home support for older adults, including mobility assistance and recording vital signs.", pricePerVisit: 150000, durationMinutes: 90, category: "Elder Care" },
  { id: "seed-service-wound", name: "Wound Dressing", description: "Wound assessment, cleaning and dressing changes in accordance with your clinician's care plan.", pricePerVisit: 80000, durationMinutes: 45, category: "Clinical" },
  { id: "seed-service-iv", name: "IV Therapy Support", description: "IV monitoring and prescribed medication support by a credential-reviewed nurse.", pricePerVisit: 120000, durationMinutes: 60, category: "Clinical" },
  { id: "service-post-surgery", name: "Post-Surgery Recovery", description: "Recovery support at home, including wound checks, mobility and prescribed care.", pricePerVisit: 180000, durationMinutes: 120, category: "Recovery" },
  { id: "service-vitals", name: "Vitals & Wellness Visit", description: "Recording blood pressure, pulse, oxygen saturation and temperature to share with your care team.", pricePerVisit: 60000, durationMinutes: 30, category: "Wellness" },
  { id: "service-personal", name: "Personal Care Support", description: "Respectful assistance with daily routines, personal hygiene and movement at home.", pricePerVisit: 100000, durationMinutes: 60, category: "Personal Care" },
];
try {
  for (const service of services) await prisma.service.upsert({ where: { id: service.id }, create: service, update: {} });
  process.stdout.write("Service catalog is ready. No user accounts or patient records were created.\n");
} finally {
  await prisma.$disconnect();
}
