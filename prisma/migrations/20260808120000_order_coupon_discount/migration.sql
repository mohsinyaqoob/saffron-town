-- Freedom Sale coupon support on Order.
--
-- `subtotalRupees` keeps its existing meaning (sum of line items, pre-discount).
-- The amount actually charged is `subtotalRupees - discountRupees`, so every
-- pre-existing row — which gets discountRupees = 0 — keeps its original total
-- and no backfill is required.

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "couponCode" VARCHAR(40);
ALTER TABLE "Order" ADD COLUMN "discountRupees" INTEGER NOT NULL DEFAULT 0;
