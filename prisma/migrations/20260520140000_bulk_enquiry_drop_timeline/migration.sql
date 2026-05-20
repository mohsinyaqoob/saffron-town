-- AlterTable
ALTER TABLE "BulkEnquiry" DROP COLUMN "timeline";

-- AlterTable (optional free-text notes)
ALTER TABLE "BulkEnquiry" ALTER COLUMN "message" DROP NOT NULL;
