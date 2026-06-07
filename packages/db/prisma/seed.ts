import { PrismaClient, Role, BookingStatus, InvoiceStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nursenest.in" },
    update: {},
    create: {
      email: "admin@nursenest.in",
      phone: "+919800000001",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: "patient@nursenest.in" },
    update: {},
    create: {
      email: "patient@nursenest.in",
      phone: "+919800000002",
      passwordHash,
      role: Role.PATIENT,
      patientProfile: {
        create: {
          fullName: "Ramesh Kumar",
          dateOfBirth: new Date("1958-03-15"),
          bloodGroup: "B+",
          allergies: "Penicillin",
          emergencyContact: "+919800000099",
          address: "12 MG Road, Bengaluru",
          lat: 12.9716,
          lng: 77.5946,
        },
      },
    },
    include: { patientProfile: true },
  });

  const nurseUser = await prisma.user.upsert({
    where: { email: "nurse@nursenest.in" },
    update: {},
    create: {
      email: "nurse@nursenest.in",
      phone: "+919800000003",
      passwordHash,
      role: Role.NURSE,
      nurseProfile: {
        create: {
          fullName: "Priya Sharma",
          certificationNumber: "KN-2019-4521",
          specializations: "Geriatric Care,Post-Surgery Recovery",
          yearsExp: 8,
          rating: 4.8,
          totalVisits: 342,
          isAvailable: true,
          currentLat: 12.9352,
          currentLng: 77.6245,
        },
      },
    },
    include: { nurseProfile: true },
  });

  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: "seed-service-elder" },
      update: {},
      create: {
        id: "seed-service-elder",
        name: "Elder Care Visit",
        description: "Comprehensive in-home care for elderly patients including vitals and mobility support.",
        pricePerVisit: 150000,
        durationMinutes: 90,
        category: "Elder Care",
      },
    }),
    prisma.service.upsert({
      where: { id: "seed-service-wound" },
      update: {},
      create: {
        id: "seed-service-wound",
        name: "Wound Dressing",
        description: "Professional wound assessment, cleaning, and dressing change.",
        pricePerVisit: 80000,
        durationMinutes: 45,
        category: "Clinical",
      },
    }),
    prisma.service.upsert({
      where: { id: "seed-service-iv" },
      update: {},
      create: {
        id: "seed-service-iv",
        name: "IV Therapy Support",
        description: "IV line monitoring and medication administration support at home.",
        pricePerVisit: 120000,
        durationMinutes: 60,
        category: "Clinical",
      },
    }),
  ]);

  const patientId = patientUser.patientProfile!.userId;
  const nurseId = nurseUser.nurseProfile!.userId;
  const service = services[0]!;

  const booking = await prisma.booking.upsert({
    where: { id: "seed-booking-1" },
    update: {},
    create: {
      id: "seed-booking-1",
      patientId,
      nurseId,
      serviceId: service.id,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: BookingStatus.CONFIRMED,
      notes: "Patient prefers morning visits",
      totalAmount: service.pricePerVisit,
    },
  });

  await prisma.invoice.upsert({
    where: { bookingId: booking.id },
    update: {},
    create: {
      bookingId: booking.id,
      amount: booking.totalAmount,
      status: InvoiceStatus.PAID,
      paidAt: new Date(),
    },
  });

  await prisma.vitalRecord.createMany({
    data: [
      {
        patientId,
        nurseId,
        heartRate: 72,
        systolic: 120,
        diastolic: 80,
        spo2: 98,
        temperature: 36.6,
        recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        patientId,
        nurseId,
        heartRate: 78,
        systolic: 125,
        diastolic: 82,
        spo2: 97,
        temperature: 36.8,
        recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        patientId,
        nurseId,
        heartRate: 74,
        systolic: 118,
        diastolic: 78,
        spo2: 99,
        temperature: 36.5,
        recordedAt: new Date(),
      },
    ],
  });

  await prisma.review.upsert({
    where: { bookingId: booking.id },
    update: {},
    create: {
      patientId,
      nurseId,
      bookingId: booking.id,
      rating: 5,
      comment: "Excellent care and very professional.",
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: patientUser.id,
        title: "Booking Confirmed",
        body: "Your Elder Care Visit has been confirmed.",
        type: "booking",
      },
      {
        userId: nurseUser.id,
        title: "New Assignment",
        body: "You have a new confirmed booking.",
        type: "booking",
      },
    ],
  });

  console.log("Seed complete:", { admin: admin.email, patient: patientUser.email, nurse: nurseUser.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
