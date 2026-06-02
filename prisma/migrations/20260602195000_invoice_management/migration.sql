-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(254),
    "phone" VARCHAR(22),
    "companyName" VARCHAR(160),
    "taxId" VARCHAR(80),
    "billingAddress" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "postalCode" VARCHAR(30),
    "country" VARCHAR(100),
    "notes" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceNumber" VARCHAR(64) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "currency" VARCHAR(8) NOT NULL DEFAULT 'INR',
    "customerId" TEXT NOT NULL,
    "customerName" VARCHAR(120) NOT NULL,
    "customerEmail" VARCHAR(254),
    "customerPhone" VARCHAR(22),
    "customerCompanyName" VARCHAR(160),
    "billingAddress" TEXT,
    "billingCity" VARCHAR(100),
    "billingState" VARCHAR(100),
    "billingPostalCode" VARCHAR(30),
    "billingCountry" VARCHAR(100),
    "subtotalPaise" INTEGER NOT NULL,
    "taxTotalPaise" INTEGER NOT NULL DEFAULT 0,
    "discountTotalPaise" INTEGER NOT NULL DEFAULT 0,
    "totalPaise" INTEGER NOT NULL,
    "notes" TEXT,
    "paymentTerms" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLineItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "description" VARCHAR(300) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPricePaise" INTEGER NOT NULL,
    "taxRatePercent" INTEGER NOT NULL DEFAULT 0,
    "discountPaise" INTEGER NOT NULL DEFAULT 0,
    "lineSubtotalPaise" INTEGER NOT NULL,
    "lineTaxPaise" INTEGER NOT NULL DEFAULT 0,
    "lineTotalPaise" INTEGER NOT NULL,

    CONSTRAINT "InvoiceLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Customer_name_idx" ON "Customer"("name");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_createdAt_idx" ON "Customer"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_customerId_idx" ON "Invoice"("customerId");

-- CreateIndex
CREATE INDEX "Invoice_status_createdAt_idx" ON "Invoice"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Invoice_issueDate_idx" ON "Invoice"("issueDate");

-- CreateIndex
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- CreateIndex
CREATE INDEX "Invoice_createdAt_idx" ON "Invoice"("createdAt");

-- CreateIndex
CREATE INDEX "InvoiceLineItem_invoiceId_sortOrder_idx" ON "InvoiceLineItem"("invoiceId", "sortOrder");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLineItem" ADD CONSTRAINT "InvoiceLineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
