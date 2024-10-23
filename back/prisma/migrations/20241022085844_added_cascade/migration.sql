-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
