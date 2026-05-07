-- CreateTable
CREATE TABLE "BulkEnquiry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(22) NOT NULL,
    "email" VARCHAR(254),
    "organization" VARCHAR(200),
    "businessType" VARCHAR(80),
    "approxGrams" VARCHAR(80),
    "timeline" VARCHAR(120),
    "message" TEXT NOT NULL,
    "clientIp" VARCHAR(45),
    "emailNotifiedAt" TIMESTAMP(3),

    CONSTRAINT "BulkEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BulkEnquiry_createdAt_idx" ON "BulkEnquiry"("createdAt");
