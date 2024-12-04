/*
  Warnings:

  - You are about to drop the column `inventoryCount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `RecentProductView` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventory` to the `products` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "RecentProductView" DROP CONSTRAINT "RecentProductView_customerId_fkey";

-- DropForeignKey
ALTER TABLE "RecentProductView" DROP CONSTRAINT "RecentProductView_productId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "inventoryCount",
ADD COLUMN     "flashSale" BOOLEAN DEFAULT false,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "inventory" INTEGER NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0;

-- DropTable
DROP TABLE "RecentProductView";

-- CreateTable
CREATE TABLE "recent_product_views" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_product_views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recent_product_views" ADD CONSTRAINT "recent_product_views_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_product_views" ADD CONSTRAINT "recent_product_views_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
