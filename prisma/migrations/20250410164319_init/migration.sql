-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "primaryPosition" TEXT,
    "fgPosition" TEXT,
    "koPosition" TEXT,
    "korPosition" TEXT,
    "puntPosition" TEXT,
    "handsTeam" BOOLEAN NOT NULL DEFAULT false,
    "height" TEXT,
    "weight" INTEGER,
    "fortyTime" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KickoffDepth" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "KickoffDepth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KickoffReturnDepth" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "KickoffReturnDepth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntDepth" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "PuntDepth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldGoalDepth" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "FieldGoalDepth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandsDepth" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "HandsDepth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "KickoffDepth_position_teamDepth_key" ON "KickoffDepth"("position", "teamDepth");

-- CreateIndex
CREATE UNIQUE INDEX "KickoffReturnDepth_position_teamDepth_key" ON "KickoffReturnDepth"("position", "teamDepth");

-- CreateIndex
CREATE UNIQUE INDEX "PuntDepth_position_teamDepth_key" ON "PuntDepth"("position", "teamDepth");

-- CreateIndex
CREATE UNIQUE INDEX "FieldGoalDepth_position_teamDepth_key" ON "FieldGoalDepth"("position", "teamDepth");

-- CreateIndex
CREATE UNIQUE INDEX "HandsDepth_position_teamDepth_key" ON "HandsDepth"("position", "teamDepth");

-- AddForeignKey
ALTER TABLE "KickoffDepth" ADD CONSTRAINT "KickoffDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KickoffReturnDepth" ADD CONSTRAINT "KickoffReturnDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntDepth" ADD CONSTRAINT "PuntDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldGoalDepth" ADD CONSTRAINT "FieldGoalDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandsDepth" ADD CONSTRAINT "HandsDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
