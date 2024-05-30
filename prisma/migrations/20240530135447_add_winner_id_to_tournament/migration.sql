-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "winner_id" TEXT;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User"("user_pkey") ON DELETE SET NULL ON UPDATE CASCADE;
