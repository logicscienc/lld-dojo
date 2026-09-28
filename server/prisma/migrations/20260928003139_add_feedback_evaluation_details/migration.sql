/*
  Warnings:

  - You are about to drop the column `category` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `criterion` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evidence` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verdict` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "category",
ADD COLUMN     "criterion" TEXT NOT NULL,
ADD COLUMN     "evidence" TEXT NOT NULL,
ADD COLUMN     "verdict" TEXT NOT NULL;
