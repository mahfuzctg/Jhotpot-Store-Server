/*
  Warnings:

  - The `image` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `recent_product_views` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "recent_product_views" DROP CONSTRAINT "recent_product_views_customerId_fkey";

-- DropForeignKey
ALTER TABLE "recent_product_views" DROP CONSTRAINT "recent_product_views_productId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];

-- DropTable
DROP TABLE "recent_product_views";

-- CreateTable
CREATE TABLE "RecentProductView" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentProductView_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecentProductView" ADD CONSTRAINT "RecentProductView_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentProductView" ADD CONSTRAINT "RecentProductView_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
