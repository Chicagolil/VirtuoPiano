-- AlterTable
ALTER TABLE "User" ADD COLUMN     "privacyConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privacyConsentAt" TIMESTAMP(3);
