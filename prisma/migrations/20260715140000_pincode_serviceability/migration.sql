-- CreateEnum
CREATE TYPE "ServiceabilityStatus" AS ENUM ('SERVICEABLE', 'NOT_SERVICEABLE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "PincodeServiceability" (
    "id" TEXT NOT NULL,
    "partnerCode" VARCHAR(60) NOT NULL,
    "pincode" VARCHAR(12) NOT NULL,
    "status" "ServiceabilityStatus" NOT NULL,
    "detail" JSONB,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PincodeServiceability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PincodeServiceability_pincode_idx" ON "PincodeServiceability"("pincode");

-- CreateIndex
CREATE UNIQUE INDEX "PincodeServiceability_partnerCode_pincode_key" ON "PincodeServiceability"("partnerCode", "pincode");
