/*
  Warnings:

  - You are about to drop the column `SecondTeamPoint` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `firstTeamPoint` on the `Guess` table. All the data in the column will be lost.
  - Added the required column `SecondTeamPoints` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstTeamPoints` to the `Guess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guess" DROP COLUMN "SecondTeamPoint",
DROP COLUMN "firstTeamPoint",
ADD COLUMN     "SecondTeamPoints" INTEGER NOT NULL,
ADD COLUMN     "firstTeamPoints" INTEGER NOT NULL;
