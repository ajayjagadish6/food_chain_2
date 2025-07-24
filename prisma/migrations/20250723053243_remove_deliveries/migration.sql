-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FoodDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donationId" INTEGER NOT NULL,
    "requestId" INTEGER NOT NULL,
    "driverId" INTEGER,
    "pickupAddress" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FoodDelivery_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FoodDelivery" ("createdAt", "deliveryAddress", "deliveryTime", "donationId", "driverId", "id", "pickupAddress", "pickupTime", "requestId", "status") SELECT "createdAt", "deliveryAddress", "deliveryTime", "donationId", "driverId", "id", "pickupAddress", "pickupTime", "requestId", "status" FROM "FoodDelivery";
DROP TABLE "FoodDelivery";
ALTER TABLE "new_FoodDelivery" RENAME TO "FoodDelivery";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
