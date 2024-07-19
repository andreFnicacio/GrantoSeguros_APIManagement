/*
  Warnings:

  - You are about to drop the column `userId` on the `Document` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "secretToken" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_secretToken_fkey" FOREIGN KEY ("secretToken") REFERENCES "User"("secretToken") ON DELETE RESTRICT ON UPDATE CASCADE;
