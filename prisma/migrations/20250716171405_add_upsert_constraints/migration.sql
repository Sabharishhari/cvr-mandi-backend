/*
  Warnings:

  - A unique constraint covering the columns `[commodityNameId]` on the table `PurchasePrice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commodityNameId]` on the table `SalesPrice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commodityNameId` to the `PurchasePrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchasePrice" ADD COLUMN     "commodityNameId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PurchasePrice_commodityNameId_key" ON "PurchasePrice"("commodityNameId");

-- CreateIndex
CREATE UNIQUE INDEX "SalesPrice_commodityNameId_key" ON "SalesPrice"("commodityNameId");
