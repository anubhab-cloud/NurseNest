-- Preserve legacy PostgreSQL arrays while matching the existing CSV application interface.
ALTER TABLE "PatientProfile" ALTER COLUMN "allergies" DROP DEFAULT;
ALTER TABLE "PatientProfile" ALTER COLUMN "allergies" TYPE TEXT USING array_to_string("allergies", ',');
ALTER TABLE "PatientProfile" ALTER COLUMN "allergies" SET DEFAULT '';
UPDATE "PatientProfile" SET "allergies" = '' WHERE "allergies" IS NULL;
ALTER TABLE "PatientProfile" ALTER COLUMN "allergies" SET NOT NULL;
ALTER TABLE "NurseProfile" ALTER COLUMN "specializations" DROP DEFAULT;
ALTER TABLE "NurseProfile" ALTER COLUMN "specializations" TYPE TEXT USING array_to_string("specializations", ',');
ALTER TABLE "NurseProfile" ALTER COLUMN "specializations" SET DEFAULT '';
UPDATE "NurseProfile" SET "specializations" = '' WHERE "specializations" IS NULL;
ALTER TABLE "NurseProfile" ALTER COLUMN "specializations" SET NOT NULL;
ALTER TABLE "VisitNote" ALTER COLUMN "attachmentUrls" DROP DEFAULT;
ALTER TABLE "VisitNote" ALTER COLUMN "attachmentUrls" TYPE TEXT USING array_to_string("attachmentUrls", ',');
ALTER TABLE "VisitNote" ALTER COLUMN "attachmentUrls" SET DEFAULT '';
UPDATE "VisitNote" SET "attachmentUrls" = '' WHERE "attachmentUrls" IS NULL;
ALTER TABLE "VisitNote" ALTER COLUMN "attachmentUrls" SET NOT NULL;

ALTER TABLE "NurseProfile" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Invoice" ADD COLUMN "razorpayPaymentId" TEXT;
CREATE UNIQUE INDEX "Invoice_razorpayOrderId_key" ON "Invoice"("razorpayOrderId");
CREATE UNIQUE INDEX "Invoice_razorpayPaymentId_key" ON "Invoice"("razorpayPaymentId");

CREATE TABLE "SessionToken" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SessionToken_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "SessionToken_expiresAt_idx" ON "SessionToken"("expiresAt");

CREATE TABLE "ChatMessage" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ChatMessage_bookingId_createdAt_idx" ON "ChatMessage"("bookingId", "createdAt");
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ContactMessage" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);
