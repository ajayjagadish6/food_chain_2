/*
  Warnings:

  - You are about to drop the column `donationId` on the `FoodDelivery` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "timeWindow" TEXT NOT NULL,
    "foodType" TEXT NOT NULL,
    "serves" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryId" INTEGER,
    CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Donation_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "FoodDelivery" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Donation" ("createdAt", "date", "donorId", "foodType", "id", "serves", "timeWindow") SELECT "createdAt", "date", "donorId", "foodType", "id", "serves", "timeWindow" FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
CREATE UNIQUE INDEX "Donation_deliveryId_key" ON "Donation"("deliveryId");
CREATE TABLE "new_FoodDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requestId" INTEGER,
    "driverId" INTEGER,
    "pickupAddress" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FoodDelivery_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "FoodRequest" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FoodDelivery_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FoodDelivery" ("createdAt", "deliveryAddress", "deliveryTime", "driverId", "id", "pickupAddress", "pickupTime", "requestId", "status") SELECT "createdAt", "deliveryAddress", "deliveryTime", "driverId", "id", "pickupAddress", "pickupTime", "requestId", "status" FROM "FoodDelivery";
DROP TABLE "FoodDelivery";
ALTER TABLE "new_FoodDelivery" RENAME TO "FoodDelivery";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
