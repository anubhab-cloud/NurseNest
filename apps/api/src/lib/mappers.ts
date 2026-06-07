import type {
  PatientProfile,
  NurseProfile,
  Service,
  Booking,
  VitalRecord,
  VisitNote,
  Notification,
  Review,
  Invoice,
  User,
} from "@nursenest/db";
import type {
  AuthUserDto,
  PatientProfileDto,
  NurseProfileDto,
  ServiceDto,
  BookingDto,
  VitalRecordDto,
  VisitNoteDto,
  NotificationDto,
  ReviewDto,
  InvoiceDto,
} from "@nursenest/types";

export function toAuthUser(user: User): AuthUserDto {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
  };
}

export function toPatientProfile(p: PatientProfile): PatientProfileDto {
  return {
    userId: p.userId,
    fullName: p.fullName,
    dateOfBirth: p.dateOfBirth.toISOString(),
    bloodGroup: p.bloodGroup,
    allergies: p.allergies ? p.allergies.split(',').filter(Boolean) : [],
    emergencyContact: p.emergencyContact,
    address: p.address,
    lat: p.lat,
    lng: p.lng,
  };
}

export function toNurseProfile(n: NurseProfile): NurseProfileDto {
  return {
    userId: n.userId,
    fullName: n.fullName,
    certificationNumber: n.certificationNumber,
    specializations: n.specializations ? n.specializations.split(',').filter(Boolean) : [],
    yearsExp: n.yearsExp,
    rating: n.rating,
    totalVisits: n.totalVisits,
    isAvailable: n.isAvailable,
    currentLat: n.currentLat,
    currentLng: n.currentLng,
  };
}

export function toService(s: Service): ServiceDto {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    pricePerVisit: s.pricePerVisit,
    durationMinutes: s.durationMinutes,
    category: s.category,
  };
}

export function toBooking(
  b: Booking & { service?: Service; patient?: PatientProfile; nurse?: NurseProfile | null },
): BookingDto {
  return {
    id: b.id,
    patientId: b.patientId,
    nurseId: b.nurseId,
    serviceId: b.serviceId,
    scheduledAt: b.scheduledAt.toISOString(),
    status: b.status,
    notes: b.notes,
    totalAmount: b.totalAmount,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    service: b.service ? toService(b.service) : undefined,
    patient: b.patient ? toPatientProfile(b.patient) : undefined,
    nurse: b.nurse ? toNurseProfile(b.nurse) : undefined,
  };
}

export function toVital(v: VitalRecord): VitalRecordDto {
  return {
    id: v.id,
    patientId: v.patientId,
    nurseId: v.nurseId,
    heartRate: v.heartRate,
    systolic: v.systolic,
    diastolic: v.diastolic,
    spo2: v.spo2,
    temperature: v.temperature,
    recordedAt: v.recordedAt.toISOString(),
  };
}

export function toVisitNote(n: VisitNote): VisitNoteDto {
  return {
    id: n.id,
    bookingId: n.bookingId,
    nurseId: n.nurseId,
    observations: n.observations,
    medications: n.medications,
    nextVisitDate: n.nextVisitDate?.toISOString() ?? null,
    attachmentUrls: n.attachmentUrls ? n.attachmentUrls.split(',').filter(Boolean) : [],
    createdAt: n.createdAt.toISOString(),
  };
}

export function toNotification(n: Notification): NotificationDto {
  return {
    id: n.id,
    userId: n.userId,
    title: n.title,
    body: n.body,
    type: n.type,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  };
}

export function toReview(r: Review): ReviewDto {
  return {
    id: r.id,
    patientId: r.patientId,
    nurseId: r.nurseId,
    bookingId: r.bookingId,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  };
}

export function toInvoice(i: Invoice): InvoiceDto {
  return {
    id: i.id,
    bookingId: i.bookingId,
    amount: i.amount,
    status: i.status,
    razorpayOrderId: i.razorpayOrderId,
    paidAt: i.paidAt?.toISOString() ?? null,
    createdAt: i.createdAt.toISOString(),
  };
}
