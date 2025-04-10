import { redirect, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { Player, User } from "@prisma/client";

import { deletePlayer } from "~/models/player.server";
import PlayerList from "~/components/PlayerList";
import { prisma } from "~/db/prisma.server";
import { canEdit, getUser, isAdmin, requireUser } from "~/utils";

type LoaderData = {
  players: (Player & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kickoffPositions?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kickoffReturnPositions?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    puntPositions?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldGoalPositions?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handsPositions?: any[];
  })[];
  user: User;
  isAdmin: boolean;
  canEdit: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }
  const players = await prisma.player.findMany({
    include: {
      kickoffPositions: true,
      kickoffReturnPositions: true,
      puntPositions: true,
      fieldGoalPositions: true,
      handsPositions: true,
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return Response.json({
    players,
    user,
    isAdmin: isAdmin(user),
    canEdit: canEdit(user),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  if (!canEdit(user)) {
    return Response.json(
      { error: "You don't have permission to modify players" },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const method = formData.get("_method");

  if (method === "delete") {
    const playerId = formData.get("playerId");

    if (typeof playerId !== "string") {
      return Response.json({ error: "Invalid player ID" }, { status: 400 });
    }

    await deletePlayer(parseInt(playerId, 10));
    return Response.json({ success: true });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
};

export default function RosterIndex() {
  const { players, canEdit: userCanEdit } = useLoaderData<LoaderData>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Player Roster</h1>

        {!userCanEdit && (
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm">
            View Only Mode
          </div>
        )}
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <PlayerList players={players} />
      </div>
    </div>
  );
}
