/*
  Warnings:

  - A unique constraint covering the columns `[customerId,vendorId]` on the table `followers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_coupons" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "customer_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "customer_coupons_customerId_couponId_key" ON "customer_coupons"("customerId", "couponId");

-- CreateIndex
CREATE UNIQUE INDEX "followers_customerId_vendorId_key" ON "followers"("customerId", "vendorId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_coupons" ADD CONSTRAINT "customer_coupons_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_coupons" ADD CONSTRAINT "customer_coupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
