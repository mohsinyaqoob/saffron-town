-- AlterTable
ALTER TABLE "Order" ADD COLUMN "source" TEXT;

-- CreateIndex
CREATE INDEX "Order_source_idx" ON "Order"("source");
