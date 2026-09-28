/*
  Warnings:

  - Added the required column `concepts` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `functionalRequirements` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hints` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rubric` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "bonusRequirements" TEXT,
ADD COLUMN     "concepts" TEXT NOT NULL,
ADD COLUMN     "functionalRequirements" TEXT NOT NULL,
ADD COLUMN     "hints" TEXT NOT NULL,
ADD COLUMN     "rubric" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");
