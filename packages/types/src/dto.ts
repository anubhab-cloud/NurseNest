import type { BookingStatus, InvoiceStatus, Role } from "./enums.js";

export interface AuthUserDto {
  id: string;
  email: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
}

export interface LoginResponseDto {
  user: AuthUserDto;
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterPatientDto {
  email: string;
  password: string;
  phone?: string;
  fullName: string;
  dateOfBirth: string;
  bloodGroup?: string;
  allergies?: string[];
  emergencyContact?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface RegisterNurseDto {
  email: string;
  password: string;
  phone?: string;
  fullName: string;
  certificationNumber: string;
  specializations?: string[];
  yearsExp?: number;
}

export interface PatientProfileDto {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  bloodGroup: string | null;
  allergies: string[];
  emergencyContact: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
}

export interface NurseProfileDto {
  userId: string;
  fullName: string;
  certificationNumber: string;
  specializations: string[];
  yearsExp: number;
  rating: number;
  totalVisits: number;
  isAvailable: boolean;
  currentLat: number | null;
  currentLng: number | null;
}

export interface ServiceDto {
  id: string;
  name: string;
  description: string;
  pricePerVisit: number;
  durationMinutes: number;
  category: string;
}

export interface BookingDto {
  id: string;
  patientId: string;
  nurseId: string | null;
  serviceId: string;
  scheduledAt: string;
  status: BookingStatus;
  notes: string | null;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  service?: ServiceDto;
  patient?: PatientProfileDto;
  nurse?: NurseProfileDto;
}

export interface VitalRecordDto {
  id: string;
  patientId: string;
  nurseId: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  spo2: number;
  temperature: number;
  recordedAt: string;
}

export interface VisitNoteDto {
  id: string;
  bookingId: string;
  nurseId: string;
  observations: string;
  medications: string | null;
  nextVisitDate: string | null;
  attachmentUrls: string[];
  createdAt: string;
}

export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReviewDto {
  id: string;
  patientId: string;
  nurseId: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface InvoiceDto {
  id: string;
  bookingId: string;
  amount: number;
  status: InvoiceStatus;
  razorpayOrderId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface PaginatedDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminStatsDto {
  totalBookings: number;
  totalRevenue: number;
  activeNurses: number;
  totalPatients: number;
  bookingsToday: number;
}

export interface PresignedUrlDto {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export interface PaymentOrderDto {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}
