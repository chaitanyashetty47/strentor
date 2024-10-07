/*
  Warnings:

  - You are about to drop the column `userId` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPurchases` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `UsersId` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_userId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_createdById_fkey";

-- DropForeignKey
ALTER TABLE "UserPurchases" DROP CONSTRAINT "UserPurchases_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UserPurchases" DROP CONSTRAINT "UserPurchases_userId_fkey";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "userId",
ADD COLUMN     "UsersId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserPurchases";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersPurchases" (
    "UsersId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersPurchases_pkey" PRIMARY KEY ("UsersId","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_supabaseId_key" ON "Users"("supabaseId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersPurchases" ADD CONSTRAINT "UsersPurchases_UsersId_fkey" FOREIGN KEY ("UsersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersPurchases" ADD CONSTRAINT "UsersPurchases_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_UsersId_fkey" FOREIGN KEY ("UsersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
