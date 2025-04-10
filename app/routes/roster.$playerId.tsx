import { redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Link } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type {
  FieldGoalDepth,
  HandsDepth,
  KickoffDepth,
  KickoffReturnDepth,
  Player,
  PuntDepth,
  User,
} from "@prisma/client";
import type { PlayerFormData } from "~/types";

import { getPlayer, updatePlayer } from "~/models/player.server";
import { getUser, canEdit, requireUser } from "~/utils/auth.server";
import PlayerForm from "~/components/PlayerForm";

type LoaderData = {
  player: Player & {
    kickoffPositions?: KickoffDepth[];
    kickoffReturnPositions?: KickoffReturnDepth[];
    puntPositions?: PuntDepth[];
    fieldGoalPositions?: FieldGoalDepth[];
    handsPositions?: HandsDepth[];
  };
  user: User;
  isAdmin: boolean;
  canEdit: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const playerId = params.playerId;

  if (!playerId || isNaN(parseInt(playerId, 10))) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }

  const userCanEdit = canEdit(user);

  const player = await getPlayer(parseInt(playerId, 10));

  if (!player) {
    throw new Response("Not Found", { status: 404 });
  }

  if (!userCanEdit) {
    // Redirect non-admins to roster page since they can't edit
    return redirect("/roster");
  }

  return Response.json({
    player,
    user,
    isAdmin: user.role === "ADMIN",
    canEdit: userCanEdit,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);

  if (!canEdit(user)) {
    return Response.json(
      { error: "You don't have permission to modify players" },
      { status: 403 }
    );
  }

  const playerId = params.playerId;

  if (!playerId || isNaN(parseInt(playerId, 10))) {
    return Response.json({ error: "Invalid player ID" }, { status: 400 });
  }

  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const primaryPosition = formData.get("primaryPosition");
  const fgPosition = formData.get("fgPosition");
  const koPosition = formData.get("koPosition");
  const korPosition = formData.get("korPosition");
  const puntPosition = formData.get("puntPosition");
  const handsTeam = formData.has("handsTeam");
  const height = formData.get("height");
  const weight = formData.get("weight");
  const fortyTime = formData.get("fortyTime");

  // Validate required fields
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    !firstName ||
    !lastName
  ) {
    return Response.json(
      { error: "First name and last name are required" },
      { status: 400 }
    );
  }

  const playerData: PlayerFormData = {
    firstName,
    lastName,
    primaryPosition:
      typeof primaryPosition === "string" ? primaryPosition : undefined,
    fgPosition: typeof fgPosition === "string" ? fgPosition : undefined,
    koPosition: typeof koPosition === "string" ? koPosition : undefined,
    korPosition: typeof korPosition === "string" ? korPosition : undefined,
    puntPosition: typeof puntPosition === "string" ? puntPosition : undefined,
    handsTeam,
    height: typeof height === "string" ? height : undefined,
    weight:
      typeof weight === "string" && weight !== ""
        ? parseInt(weight, 10)
        : undefined,
    fortyTime:
      typeof fortyTime === "string" && fortyTime !== ""
        ? parseFloat(fortyTime)
        : undefined,
  };

  await updatePlayer(parseInt(playerId, 10), playerData);
  return redirect("/roster");
};

export default function EditPlayer() {
  const { player } = useLoaderData<LoaderData>();
  const actionData = useActionData<{ error?: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Player: {player.firstName} {player.lastName}
        </h1>
        <Link
          to="/roster"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <PlayerForm player={player} error={actionData?.error} />
      </div>
    </div>
  );
}
