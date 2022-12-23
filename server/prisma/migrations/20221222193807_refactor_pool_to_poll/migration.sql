/*
  Warnings:

  - You are about to drop the column `poolId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the `Pool` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,pollId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pollId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_poolId_fkey";

-- DropForeignKey
ALTER TABLE "Pool" DROP CONSTRAINT "Pool_ownerId_fkey";

-- DropIndex
DROP INDEX "Participant_userId_poolId_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "poolId",
ADD COLUMN     "pollId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Pool";

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poll_code_key" ON "Poll"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_userId_pollId_key" ON "Participant"("userId", "pollId");

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
