# NurseNest Reference

## API routes (`/api/v1`)

### Auth
- `POST /auth/register` — body includes `role`: PATIENT | NURSE
- `POST /auth/login` — sets httpOnly cookies
- `POST /auth/logout` — revokes refresh in Redis
- `POST /auth/refresh`
- `POST /auth/forgot-password` / `POST /auth/reset-password`

### Patient (auth + PATIENT)
- `GET/PATCH /patients/me`
- `GET /patients/me/vitals`
- `GET /patients/me/bookings`
- `GET /patients/me/notifications`

### Nurses
- `GET /nurses/available`
- `GET /nurses/:id` / `GET /nurses/:id/reviews`
- `PATCH /nurses/me/availability` / `PATCH /nurses/me/location`

### Nurse dashboard (`/nurse`, auth + NURSE)
- `GET /nurse/me` / `GET /nurse/me/bookings` / `GET /nurse/me/patients`
- `GET /nurse/patients/:patientId`
- `POST /nurse/notes/:bookingId`
- `GET /nurse/me/invoices`

### Bookings, vitals, payments, admin, files, services
See README and route files under `apps/api/src/routes/`.

## Socket events

| Server → Client | Payload |
|-----------------|---------|
| `vitals:update` | patientId, heartRate, spo2, bp, temp, recordedAt |
| `nurse:location` | nurseId, lat, lng, eta? |
| `booking:status` | bookingId, status, message |
| `notification:new` | title, body, type |
| `alert:critical` | patientId, message, type |

| Client → Server | |
|-----------------|---|
| `room:join` / `room:leave` | { roomId } |
| `nurse:location:update` | { lat, lng } (nurse only) |

## Web routes

- Public: `/`, `/services`, `/nurses`, `/nurses/[id]`, `/about`, `/contact`
- Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`
- Patient: `/dashboard/patient/*`
- Nurse: `/dashboard/nurse/*`
- Admin: `/dashboard/admin/*`

## Env (API)

`DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `WEB_ORIGIN`, Razorpay, Twilio, Resend, R2, `SENTRY_DSN`

## Env (Web)

`NEXT_PUBLIC_API_URL` (use `http://localhost:3000` with rewrites), `INTERNAL_API_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SOCKET_URL`

## Prisma models

User, PatientProfile, NurseProfile, Service, Booking, VitalRecord, VisitNote, Notification, Review, Invoice

Enums: Role, BookingStatus, InvoiceStatus
