-- Course purchase options, per-option pricing, structured Irish addresses, and support tickets.

-- CreateEnum
CREATE TYPE "CourseFormat" AS ENUM ('VIDEO_AND_BOOKLET', 'BOOKLET_ONLY');

-- CreateEnum
CREATE TYPE "PurchaseOption" AS ENUM ('FULL', 'FULL_PHYSICAL', 'DIGITAL_BOOKLET', 'PHYSICAL_BOOKLET');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'RESOLVED');

-- Course: format + per-option pricing replaces the single price.
ALTER TABLE "Course" ADD COLUMN "format" "CourseFormat" NOT NULL DEFAULT 'VIDEO_AND_BOOKLET';
ALTER TABLE "Course" ADD COLUMN "fullPriceCents" INTEGER;
ALTER TABLE "Course" ADD COLUMN "fullPhysicalPriceCents" INTEGER;
ALTER TABLE "Course" ADD COLUMN "digitalBookletPriceCents" INTEGER;
ALTER TABLE "Course" ADD COLUMN "physicalBookletPriceCents" INTEGER;
ALTER TABLE "Course" DROP COLUMN "price";

-- User: replace single free-text address with structured Irish address fields.
ALTER TABLE "User" DROP COLUMN "address";
ALTER TABLE "User" ADD COLUMN "addressLine1" TEXT;
ALTER TABLE "User" ADD COLUMN "addressLine2" TEXT;
ALTER TABLE "User" ADD COLUMN "city" TEXT;
ALTER TABLE "User" ADD COLUMN "county" TEXT;
ALTER TABLE "User" ADD COLUMN "eircode" TEXT;

-- Purchase: chosen option + snapshot of the shipping address.
ALTER TABLE "Purchase" ADD COLUMN "option" "PurchaseOption" NOT NULL DEFAULT 'FULL';
ALTER TABLE "Purchase" ADD COLUMN "shipLine1" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "shipLine2" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "shipCity" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "shipCounty" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "shipEircode" TEXT;

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket"("userId");

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
