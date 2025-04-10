import { prisma } from "~/db/prisma.server";
import type { Player } from "@prisma/client";
import type { PlayerFormData, PlayerWithPositions } from "~/types";

export async function getPlayers(): Promise<Player[]> {
  return prisma.player.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}

export async function getPlayer(
  id: number
): Promise<PlayerWithPositions | null> {
  return prisma.player.findUnique({
    where: { id },
    include: {
      kickoffPositions: true,
      kickoffReturnPositions: true,
      puntPositions: true,
      fieldGoalPositions: true,
      handsPositions: true,
    },
  });
}

export async function createPlayer(data: PlayerFormData): Promise<Player> {
  return prisma.player.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      primaryPosition: data.primaryPosition,
      fgPosition: data.fgPosition,
      koPosition: data.koPosition,
      korPosition: data.korPosition,
      puntPosition: data.puntPosition,
      handsTeam: data.handsTeam,
      height: data.height,
      weight: data.weight,
      fortyTime: data.fortyTime,
    },
  });
}

export async function updatePlayer(
  id: number,
  data: PlayerFormData
): Promise<Player> {
  return prisma.player.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      primaryPosition: data.primaryPosition,
      fgPosition: data.fgPosition,
      koPosition: data.koPosition,
      korPosition: data.korPosition,
      puntPosition: data.puntPosition,
      handsTeam: data.handsTeam,
      height: data.height,
      weight: data.weight,
      fortyTime: data.fortyTime,
    },
  });
}

export async function deletePlayer(id: number): Promise<Player> {
  return prisma.player.delete({
    where: { id },
  });
}

export async function searchPlayers(searchTerm: string): Promise<Player[]> {
  return prisma.player.findMany({
    where: {
      OR: [
        { firstName: { contains: searchTerm } },
        { lastName: { contains: searchTerm } },
        { primaryPosition: { contains: searchTerm } },
      ],
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}

export async function getPlayersForSpecialTeam(
  teamType: string,
  position?: string
): Promise<Player[]> {
  const tableName = teamType.toLowerCase().replace(/_/g, "") + "Positions";

  const where = position
    ? { [tableName]: { some: { position } } }
    : { [tableName]: { some: {} } };

  return prisma.player.findMany({
    where,
    include: {
      [tableName]: true,
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}

export async function getPlayersWithKickoffPositions(): Promise<
  PlayerWithPositions[]
> {
  return prisma.player.findMany({
    include: {
      kickoffPositions: true,
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}

// Similar functions can be created for other special teams
