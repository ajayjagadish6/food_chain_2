/*
  Warnings:

  - You are about to drop the column `requestId` on the `FoodDelivery` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FoodDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "driverId" INTEGER,
    "pickupAddress" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FoodDelivery_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FoodDelivery" ("createdAt", "deliveryAddress", "deliveryTime", "driverId", "id", "pickupAddress", "pickupTime", "status") SELECT "createdAt", "deliveryAddress", "deliveryTime", "driverId", "id", "pickupAddress", "pickupTime", "status" FROM "FoodDelivery";
DROP TABLE "FoodDelivery";
ALTER TABLE "new_FoodDelivery" RENAME TO "FoodDelivery";
CREATE TABLE "new_FoodRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipientId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "timeWindow" TEXT NOT NULL,
    "foodType" TEXT NOT NULL,
    "serves" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryId" INTEGER,
    CONSTRAINT "FoodRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FoodRequest_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "FoodDelivery" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FoodRequest" ("createdAt", "date", "foodType", "id", "recipientId", "serves", "timeWindow") SELECT "createdAt", "date", "foodType", "id", "recipientId", "serves", "timeWindow" FROM "FoodRequest";
DROP TABLE "FoodRequest";
ALTER TABLE "new_FoodRequest" RENAME TO "FoodRequest";
CREATE UNIQUE INDEX "FoodRequest_deliveryId_key" ON "FoodRequest"("deliveryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
