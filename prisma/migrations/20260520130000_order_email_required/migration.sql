-- Backfill any rows created while email was optional, then require again.
UPDATE "Order" SET "email" = '' WHERE "email" IS NULL;
ALTER TABLE "Order" ALTER COLUMN "email" SET NOT NULL;
