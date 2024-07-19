-- AlterTable
ALTER TABLE "User" ADD COLUMN     "secretToken" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "cnpj_contratante" TEXT NOT NULL,
    "contracted_value" TEXT NOT NULL,
    "initial_validity" TEXT NOT NULL,
    "duration" TEXT,
    "contratante" TEXT NOT NULL,
    "contratada" TEXT NOT NULL,
    "secretToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
