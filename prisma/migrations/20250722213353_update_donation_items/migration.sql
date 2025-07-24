/*
  Warnings:

  - You are about to drop the column `isVegetarian` on the `Donation` table. All the data in the column will be lost.
  - Added the required column `nonVegetarianCount` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vegetarianCount` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "timeWindow" TEXT NOT NULL,
    "vegetarianCount" INTEGER NOT NULL,
    "nonVegetarianCount" INTEGER NOT NULL,
    "serves" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donation" ("createdAt", "date", "donorId", "id", "serves", "timeWindow", "vegetarianCount", "nonVegetarianCount")
SELECT "createdAt", "date", "donorId", "id", "serves", "timeWindow", 0, 0 FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
