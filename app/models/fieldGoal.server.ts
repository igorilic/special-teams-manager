import { prisma } from "~/db/prisma.server";
import type { FieldGoalDepth } from "@prisma/client";
import type { DepthChartPositionType } from "~/types";
import { sortPositions } from "~/utils/positions";

// Get all players in the field goal team for a specific team depth
export async function getFieldGoalTeam(
  teamDepth: number = 1
): Promise<DepthChartPositionType[]> {
  const positions = await prisma.fieldGoalDepth.findMany({
    where: { teamDepth },
    include: {
      player: {
        select: {
          firstName: true,
          lastName: true,
          primaryPosition: true,
        },
      },
    },
  });

  // Format data for frontend use
  return positions.map((pos) => ({
    id: String(pos.id),
    position: pos.position,
    teamDepth: pos.teamDepth,
    playerId: pos.playerId,
    playerName: `${pos.player.firstName} ${pos.player.lastName}`,
    primaryPosition: pos.player.primaryPosition || undefined,
  }));
}

// Get player assigned to a specific position
export async function getPositionPlayer(
  position: string,
  teamDepth: number = 1
): Promise<FieldGoalDepth | null> {
  return prisma.fieldGoalDepth.findUnique({
    where: {
      position_teamDepth: {
        position,
        teamDepth,
      },
    },
    include: {
      player: true,
    },
  });
}

// Assign a player to a position
export async function assignPlayerToPosition(
  playerId: number,
  position: string,
  teamDepth: number
): Promise<FieldGoalDepth> {
  // Using upsert to either update or create the record
  return prisma.fieldGoalDepth.upsert({
    where: {
      position_teamDepth: {
        position,
        teamDepth,
      },
    },
    update: {
      playerId,
    },
    create: {
      playerId,
      position,
      teamDepth,
    },
  });
}

// Remove a player from a position
export async function removePlayerFromPosition(
  position: string,
  teamDepth: number
): Promise<FieldGoalDepth> {
  return prisma.fieldGoalDepth.delete({
    where: {
      position_teamDepth: {
        position,
        teamDepth,
      },
    },
  });
}

// Get all positions for a player
export async function getPlayerAssignments(
  playerId: number
): Promise<FieldGoalDepth[]> {
  return prisma.fieldGoalDepth.findMany({
    where: { playerId },
    orderBy: [{ teamDepth: "asc" }, { position: "asc" }],
  });
}

// Get all depth charts (1st, 2nd, 3rd team)
export async function getAllFieldGoalDepths(): Promise<
  Record<number, DepthChartPositionType[]>
> {
  const results: Record<number, DepthChartPositionType[]> = {};

  for (let depth = 1; depth <= 3; depth++) {
    const positions = await getFieldGoalTeam(depth);
    results[depth] = sortPositions(positions, "FIELD_GOAL");
  }

  return results;
}

// Get filled positions for a team depth
export async function getFilledPositions(
  teamDepth: number = 1
): Promise<string[]> {
  const positions = await prisma.fieldGoalDepth.findMany({
    where: { teamDepth },
    select: { position: true },
  });

  return positions.map((p) => p.position);
}

// Get team with detailed player info
export async function getTeamWithPlayerDetails(
  teamDepth: number = 1
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  const positions = await prisma.fieldGoalDepth.findMany({
    where: { teamDepth },
    include: {
      player: {
        select: {
          firstName: true,
          lastName: true,
          primaryPosition: true,
          height: true,
          weight: true,
          fortyTime: true,
        },
      },
    },
  });

  const result = positions.map((pos) => ({
    ...pos,
    playerName: `${pos.player.firstName} ${pos.player.lastName}`,
  }));

  return sortPositions(result, "FIELD_GOAL");
}
