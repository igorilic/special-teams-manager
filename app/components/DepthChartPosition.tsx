import { useState } from "react";
import { Form } from "@remix-run/react";
import type { Player } from "@prisma/client";
import type { PositionInfo } from "~/types";

interface DepthChartPositionProps {
  position: PositionInfo;
  teamDepth: number;
  player?: {
    id: number;
    firstName: string;
    lastName: string;
    primaryPosition?: string | null;
  } | null;
  availablePlayers: Player[];
  teamType: string;
}

export default function DepthChartPosition({
  position,
  teamDepth,
  player,
  availablePlayers,
  teamType,
}: DepthChartPositionProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="absolute top-2 right-2 text-xs font-medium text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
        {teamDepth === 1 ? "1st" : teamDepth === 2 ? "2nd" : "3rd"} Team
      </div>

      <h3 className="text-sm font-medium text-gray-500 mb-1">
        {position.name}
      </h3>

      {player && !isEditing ? (
        <div className="mt-2">
          <div className="font-medium text-gray-900">
            {player.firstName} {player.lastName}
          </div>
          {player.primaryPosition && (
            <div className="text-xs text-gray-500">
              {player.primaryPosition}
            </div>
          )}
          <div className="mt-3 flex space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              Change
            </button>
            <Form method="post">
              <input type="hidden" name="_action" value="removePlayer" />
              <input type="hidden" name="position" value={position.id} />
              <input type="hidden" name="teamDepth" value={teamDepth} />
              <input type="hidden" name="teamType" value={teamType} />
              <button
                type="submit"
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
              >
                Remove
              </button>
            </Form>
          </div>
        </div>
      ) : (
        <Form method="post" className="mt-2">
          <input type="hidden" name="_action" value="assignPlayer" />
          <input type="hidden" name="position" value={position.id} />
          <input type="hidden" name="teamDepth" value={teamDepth} />
          <input type="hidden" name="teamType" value={teamType} />

          <select
            name="playerId"
            className="block w-full px-3 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={player?.id || ""}
            required
          >
            <option value="">Select player</option>
            {availablePlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}{" "}
                {p.primaryPosition ? `(${p.primaryPosition})` : ""}
              </option>
            ))}
          </select>

          <div className="mt-3 flex space-x-2">
            <button
              type="submit"
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
            >
              {player ? "Save" : "Assign"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </Form>
      )}
    </div>
  );
}
