/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "image",
ADD COLUMN     "hello" TEXT,
ADD COLUMN     "vaultId" TEXT;

-- CreateTable
CREATE TABLE "Vault" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vault_id_key" ON "Vault"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE SET NULL ON UPDATE CASCADE;
