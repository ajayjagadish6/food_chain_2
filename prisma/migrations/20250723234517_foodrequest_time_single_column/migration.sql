/*
  Warnings:

  - You are about to drop the column `timeWindow` on the `FoodRequest` table. All the data in the column will be lost.
  - Added the required column `time` to the `FoodRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FoodRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipientId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "foodType" TEXT NOT NULL,
    "serves" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryId" INTEGER,
    CONSTRAINT "FoodRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FoodRequest_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "FoodDelivery" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FoodRequest" ("createdAt", "date", "deliveryId", "foodType", "id", "recipientId", "serves") SELECT "createdAt", "date", "deliveryId", "foodType", "id", "recipientId", "serves" FROM "FoodRequest";
DROP TABLE "FoodRequest";
ALTER TABLE "new_FoodRequest" RENAME TO "FoodRequest";
CREATE UNIQUE INDEX "FoodRequest_deliveryId_key" ON "FoodRequest"("deliveryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
