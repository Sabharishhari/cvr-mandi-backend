/*
  Warnings:

  - Changed the type of `dailySalesPriceId` on the `SalesPrice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SalesPrice" DROP COLUMN "dailySalesPriceId",
ADD COLUMN     "dailySalesPriceId" JSONB NOT NULL,
ALTER COLUMN "dateOfPrice" SET DATA TYPE TEXT;
