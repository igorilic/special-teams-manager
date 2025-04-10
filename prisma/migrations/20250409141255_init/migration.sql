-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "fortyTime" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "KickoffDepth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "KickoffDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KickoffReturnDepth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "KickoffReturnDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PuntDepth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "PuntDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FieldGoalDepth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "FieldGoalDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HandsDepth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" TEXT NOT NULL,
    "teamDepth" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "HandsDepth_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
