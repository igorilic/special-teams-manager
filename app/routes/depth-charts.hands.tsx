import { useLoaderData, useActionData } from "@remix-run/react";
import { useState } from "react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { Player } from "@prisma/client";
import type { DepthChartPositionType } from "~/types";

import {
  getHandsTeam,
  assignPlayerToPosition,
  removePlayerFromPosition,
} from "~/models/hands.server";
import { getPlayers } from "~/models/player.server";
import { TEAMS, POSITIONS, TEAM_DEPTH, sortPositions } from "~/utils/positions";
import DepthChartSelector from "~/components/DepthChartSelector";
import DepthChartPosition from "~/components/DepthChartPosition";

type LoaderData = {
  team: Record<number, DepthChartPositionType[]>;
  players: Player[];
  currentTeam: string;
};

export const loader: LoaderFunction = async () => {
  // Get all depth charts (1st, 2nd, 3rd team)
  const team: Record<number, DepthChartPositionType[]> = {};

  for (let depth = 1; depth <= 3; depth++) {
    const positions = await getHandsTeam(depth);
    team[depth] = sortPositions(positions, "HANDS");
  }

  const players = await getPlayers();

  return Response.json({
    team,
    players,
    currentTeam: TEAMS.HANDS,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "assignPlayer") {
    const playerId = formData.get("playerId");
    const position = formData.get("position");
    const teamDepth = formData.get("teamDepth");

    if (
      typeof playerId !== "string" ||
      typeof position !== "string" ||
      typeof teamDepth !== "string" ||
      !playerId
    ) {
      return Response.json({ error: "Invalid form data" }, { status: 400 });
    }

    await assignPlayerToPosition(
      parseInt(playerId, 10),
      position,
      parseInt(teamDepth, 10)
    );

    return Response.json({ success: true });
  }

  if (action === "removePlayer") {
    const position = formData.get("position");
    const teamDepth = formData.get("teamDepth");

    if (typeof position !== "string" || typeof teamDepth !== "string") {
      return Response.json({ error: "Invalid form data" }, { status: 400 });
    }

    await removePlayerFromPosition(position, parseInt(teamDepth, 10));

    return Response.json({ success: true });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
};

export default function HandsDepthChart() {
  const { team, players, currentTeam } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const [activeTeamDepth, setActiveTeamDepth] = useState(1);

  // Get a map of position IDs to player data for the current team depth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const positionsMap: Record<string, any> = {};

  if (team[activeTeamDepth]) {
    team[activeTeamDepth].forEach((pos) => {
      positionsMap[pos.position] = {
        id: pos.playerId,
        firstName: pos.playerName?.split(" ")[0] || "",
        lastName: pos.playerName?.split(" ").slice(1).join(" ") || "",
        primaryPosition: pos.primaryPosition,
      };
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          {currentTeam} Depth Chart
        </h1>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="border-b border-gray-200">
          <DepthChartSelector currentTeam={currentTeam} />
        </div>

        <div className="px-4 py-5 sm:p-6">
          {/* Team Depth Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {TEAM_DEPTH.map((depth) => (
                <button
                  key={depth.value}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTeamDepth === depth.value
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                  onClick={() => setActiveTeamDepth(depth.value)}
                >
                  {depth.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Error message */}
          {actionData?.error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {actionData.error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Positions Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {POSITIONS.HANDS.map((position) => (
              <DepthChartPosition
                key={`${position.id}-${activeTeamDepth}`}
                position={position}
                teamDepth={activeTeamDepth}
                player={positionsMap[position.id] || null}
                availablePlayers={players}
                teamType="HANDS"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
