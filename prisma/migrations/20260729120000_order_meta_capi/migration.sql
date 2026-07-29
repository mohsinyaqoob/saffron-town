-- Meta Conversions API: attribution context captured from the browser at
-- checkout (the Razorpay webhook has no cookies), plus a one-shot send guard.
-- fbp/fbc/ip/user-agent are stored RAW — Meta requires them unhashed.

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "fbp" VARCHAR(255);
ALTER TABLE "Order" ADD COLUMN "fbc" VARCHAR(500);
ALTER TABLE "Order" ADD COLUMN "clientIp" VARCHAR(64);
ALTER TABLE "Order" ADD COLUMN "clientUserAgent" TEXT;
ALTER TABLE "Order" ADD COLUMN "capiPurchaseSentAt" TIMESTAMP(3);
