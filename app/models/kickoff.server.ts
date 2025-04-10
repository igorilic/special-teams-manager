import { prisma } from "~/db/prisma.server";
import type { KickoffDepth } from "@prisma/client";
import type { DepthChartPosition } from "~/types";
import { sortPositions } from "~/utils/positions";

// Get all players in the kickoff team for a specific team depth
export async function getKickoffTeam(
  teamDepth: number = 1
): Promise<DepthChartPosition[]> {
  const positions = await prisma.kickoffDepth.findMany({
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
): Promise<KickoffDepth | null> {
  return prisma.kickoffDepth.findUnique({
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
): Promise<KickoffDepth> {
  // Using upsert to either update or create the record
  return prisma.kickoffDepth.upsert({
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
): Promise<KickoffDepth> {
  return prisma.kickoffDepth.delete({
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
): Promise<KickoffDepth[]> {
  return prisma.kickoffDepth.findMany({
    where: { playerId },
    orderBy: [{ teamDepth: "asc" }, { position: "asc" }],
  });
}

// Get all depth charts (1st, 2nd, 3rd team)
export async function getAllKickoffDepths(): Promise<
  Record<number, DepthChartPosition[]>
> {
  const results: Record<number, DepthChartPosition[]> = {};

  for (let depth = 1; depth <= 3; depth++) {
    const positions = await getKickoffTeam(depth);
    results[depth] = sortPositions(positions, "KICKOFF");
  }

  return results;
}

// Get filled positions for a team depth
export async function getFilledPositions(
  teamDepth: number = 1
): Promise<string[]> {
  const positions = await prisma.kickoffDepth.findMany({
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
  const positions = await prisma.kickoffDepth.findMany({
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

  return sortPositions(result, "KICKOFF");
}
