-- Capture enrolment details: student name per purchase, address on the account holder.
ALTER TABLE "User" ADD COLUMN "address" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "studentName" TEXT;
