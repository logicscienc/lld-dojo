/*
  Warnings:

  - You are about to drop the column `userId` on the `Attempt` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_userId_fkey";

-- DropIndex
DROP INDEX "Attempt_userId_idx";

-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
