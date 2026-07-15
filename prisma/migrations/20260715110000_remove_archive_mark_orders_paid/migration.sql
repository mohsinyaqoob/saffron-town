-- One-time data fix (2026-07-15): all orders existing at this date are real,
-- fulfilled payments — mark them PAID. Bounded by date so orders created
-- after this migration was written are never touched.
UPDATE "Order" SET "status" = 'PAID' WHERE "createdAt" < '2026-07-16 00:00:00+05:30';

-- Remove archive functionality
DROP INDEX IF EXISTS "Order_archivedAt_idx";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "archivedAt";
