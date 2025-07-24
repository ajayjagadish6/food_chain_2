/*
  Warnings:

  - Added the required column `foodType` to the `FoodRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FoodRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipientId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "timeWindow" TEXT NOT NULL,
    "foodType" TEXT NOT NULL,
    "serves" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FoodRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FoodRequest" ("createdAt", "date", "id", "recipientId", "serves", "timeWindow") SELECT "createdAt", "date", "id", "recipientId", "serves", "timeWindow" FROM "FoodRequest";
DROP TABLE "FoodRequest";
ALTER TABLE "new_FoodRequest" RENAME TO "FoodRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
