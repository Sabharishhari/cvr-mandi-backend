/*
  Warnings:

  - Changed the type of `dailyPriceId` on the `PurchasePrice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PurchasePrice" DROP COLUMN "dailyPriceId",
ADD COLUMN     "dailyPriceId" JSONB NOT NULL;
