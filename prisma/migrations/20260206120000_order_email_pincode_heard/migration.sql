-- AlterTable
ALTER TABLE "Order" ADD COLUMN "email" TEXT;
ALTER TABLE "Order" ADD COLUMN "pincode" TEXT;
ALTER TABLE "Order" ADD COLUMN "heardAboutUs" TEXT;

UPDATE "Order" SET "email" = 'legacy@unknown.invalid' WHERE "email" IS NULL;
UPDATE "Order" SET "pincode" = '000000' WHERE "pincode" IS NULL;

ALTER TABLE "Order" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "pincode" SET NOT NULL;
