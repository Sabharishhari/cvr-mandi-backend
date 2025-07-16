-- CreateTable
CREATE TABLE "PurchasePrice" (
    "id" TEXT NOT NULL,
    "dailyPriceId" TEXT NOT NULL,
    "dateField" TIMESTAMP(3) NOT NULL,
    "minPurchasePriceKg" DOUBLE PRECISION NOT NULL,
    "maxPurchasePriceKg" DOUBLE PRECISION NOT NULL,
    "dateOfPrice" TIMESTAMP(3) NOT NULL,
    "commodityName" TEXT NOT NULL,
    "commodityCode" TEXT NOT NULL,
    "maxPmp" DOUBLE PRECISION NOT NULL,
    "minPmp" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchasePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesPrice" (
    "id" TEXT NOT NULL,
    "dailySalesPriceId" TEXT NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "dateOfPrice" TIMESTAMP(3) NOT NULL,
    "commodityCode" TEXT NOT NULL,
    "siNo" TEXT NOT NULL,
    "commodityName" TEXT NOT NULL,
    "commodityNameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesPrice_pkey" PRIMARY KEY ("id")
);
