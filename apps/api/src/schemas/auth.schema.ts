import { z } from "zod";
import { emailSchema, passwordSchema } from "@nursenest/utils";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const registerPatientSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().optional(),
  fullName: z.string().min(2),
  dateOfBirth: z.string().datetime({ offset: true }).or(z.string().date()),
  bloodGroup: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const registerNurseSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().optional(),
  fullName: z.string().min(2),
  certificationNumber: z.string().min(3),
  specializations: z.array(z.string()).optional(),
  yearsExp: z.number().int().min(0).optional(),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});
