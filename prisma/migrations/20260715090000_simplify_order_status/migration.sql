-- Simplify order lifecycle to PENDING -> PAID | FAILED.
-- Consolidates the old duplicated paymentStatus (string) column into the
-- status enum, which was the source of orders stuck at "Pending".

-- 1. Temporarily widen status to TEXT so we can remap values freely
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE TEXT USING "status"::TEXT;

-- 2. Merge paymentStatus + legacy enum values into the 3-state model.
--    Payment evidence wins: paymentStatus PAID => PAID regardless of status.
UPDATE "Order" SET "status" = CASE
  WHEN "paymentStatus" = 'PAID' THEN 'PAID'
  WHEN "status" IN ('CONFIRMED', 'COMPLETED', 'DELIVERED') THEN 'PAID'
  WHEN "paymentStatus" = 'FAILED' THEN 'FAILED'
  WHEN "status" IN ('CANCELLED', 'FAILED') THEN 'FAILED'
  ELSE 'PENDING'
END;

-- 3. Rebuild the enum with only the 3 lifecycle values
DROP TYPE "OrderStatus";
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus" USING "status"::"OrderStatus";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- 4. Drop the now-redundant duplicate column
ALTER TABLE "Order" DROP COLUMN "paymentStatus";
