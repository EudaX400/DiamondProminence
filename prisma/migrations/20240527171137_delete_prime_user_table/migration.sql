-- CreateTable
CREATE TABLE "Tournament" (
    "tournament_pkey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "numPlayers" INTEGER NOT NULL,
    "description" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "privatePassword" TEXT,
    "owner_id" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("tournament_pkey")
);

-- CreateTable
CREATE TABLE "User" (
    "user_pkey" TEXT NOT NULL,
    "name" TEXT,
    "lastName" TEXT,
    "user_email_key" TEXT,
    "country" TEXT,
    "password" TEXT,
    "position" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_username_key" TEXT,
    "prime" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_pkey")
);

-- CreateTable
CREATE TABLE "tournament_participant_pkey" (
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_participant_pkey_pkey" PRIMARY KEY ("tournamentId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key_key" ON "User"("user_email_key");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_username_key_key" ON "User"("user_username_key");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("user_pkey") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_participant_pkey" ADD CONSTRAINT "tournament_participant_pkey_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("tournament_pkey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_participant_pkey" ADD CONSTRAINT "tournament_participant_pkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_pkey") ON DELETE RESTRICT ON UPDATE CASCADE;
