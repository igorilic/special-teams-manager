import { Form } from "@remix-run/react";
import { useState } from "react";
import type {
  Player,
  KickoffDepth,
  KickoffReturnDepth,
  PuntDepth,
  FieldGoalDepth,
  HandsDepth,
} from "@prisma/client";
import { FOOTBALL_POSITIONS } from "~/utils/positions";

interface PlayerFormProps {
  player?: Player & {
    kickoffPositions?: KickoffDepth[];
    kickoffReturnPositions?: KickoffReturnDepth[];
    puntPositions?: PuntDepth[];
    fieldGoalPositions?: FieldGoalDepth[];
    handsPositions?: HandsDepth[];
  };
  error?: string;
}

export default function PlayerForm({ player, error }: PlayerFormProps) {
  const [specialTeamsView, setSpecialTeamsView] = useState(false);

  // Set default values or empty strings for controlled inputs
  const defaultValues = {
    firstName: player?.firstName || "",
    lastName: player?.lastName || "",
    primaryPosition: player?.primaryPosition || "",
    fgPosition: player?.fgPosition || "",
    koPosition: player?.koPosition || "",
    korPosition: player?.korPosition || "",
    puntPosition: player?.puntPosition || "",
    handsTeam: player?.handsTeam || false,
    height: player?.height || "",
    weight: player?.weight?.toString() || "",
    fortyTime: player?.fortyTime?.toString() || "",
  };

  // Format team depth for display
  const formatTeamDepth = (depth: number) => {
    return depth === 1 ? "1st Team" : depth === 2 ? "2nd Team" : "3rd Team";
  };

  return (
    <Form method="post" className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Basic Info Section */}
        <div className="sm:col-span-3">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First name*
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              defaultValue={defaultValues.firstName}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last name*
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              defaultValue={defaultValues.lastName}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="primaryPosition"
            className="block text-sm font-medium text-gray-700"
          >
            Primary Position
          </label>
          <div className="mt-1">
            <select
              id="primaryPosition"
              name="primaryPosition"
              defaultValue={defaultValues.primaryPosition}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select position</option>
              {FOOTBALL_POSITIONS.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="height"
            className="block text-sm font-medium text-gray-700"
          >
            Height
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="height"
              id="height"
              placeholder="80"
              defaultValue={defaultValues.height}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700"
          >
            Weight (lbs)
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="weight"
              id="weight"
              defaultValue={defaultValues.weight}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="fortyTime"
            className="block text-sm font-medium text-gray-700"
          >
            40yd Time
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="fortyTime"
              id="fortyTime"
              step="0.01"
              placeholder="4.50"
              defaultValue={defaultValues.fortyTime}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Button to toggle special teams view */}
        <div className="sm:col-span-6">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
            onClick={() => setSpecialTeamsView(!specialTeamsView)}
          >
            <span>
              {specialTeamsView ? "Hide" : "Show"} Special Teams Positions
            </span>
          </button>
        </div>

        {/* Special Teams Positions Section */}
        {specialTeamsView && (
          <>
            <div className="sm:col-span-6">
              <h3 className="text-lg font-medium text-gray-900">
                Special Teams Positions
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Player&apos;s positions on special teams.
              </p>
            </div>

            {/* Current Special Team Assignments */}
            {player && (
              <div className="sm:col-span-6 bg-gray-50 p-4 rounded-md mb-6">
                <h4 className="font-medium text-gray-700 mb-2">
                  Current Assignments
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Kickoff Positions */}
                  {player.kickoffPositions &&
                  player.kickoffPositions.length > 0 ? (
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h5 className="font-medium text-blue-700">Kickoff</h5>
                      <ul className="mt-2 space-y-1">
                        {player.kickoffPositions.map((pos) => (
                          <li key={`ko-${pos.id}`} className="text-sm">
                            {pos.position} - {formatTeamDepth(pos.teamDepth)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Kickoff Return Positions */}
                  {player.kickoffReturnPositions &&
                  player.kickoffReturnPositions.length > 0 ? (
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h5 className="font-medium text-green-700">
                        Kickoff Return
                      </h5>
                      <ul className="mt-2 space-y-1">
                        {player.kickoffReturnPositions.map((pos) => (
                          <li key={`kor-${pos.id}`} className="text-sm">
                            {pos.position} - {formatTeamDepth(pos.teamDepth)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Punt Positions */}
                  {player.puntPositions && player.puntPositions.length > 0 ? (
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h5 className="font-medium text-purple-700">Punt</h5>
                      <ul className="mt-2 space-y-1">
                        {player.puntPositions.map((pos) => (
                          <li key={`punt-${pos.id}`} className="text-sm">
                            {pos.position} - {formatTeamDepth(pos.teamDepth)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Field Goal Positions */}
                  {player.fieldGoalPositions &&
                  player.fieldGoalPositions.length > 0 ? (
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h5 className="font-medium text-yellow-700">
                        Field Goal/PAT
                      </h5>
                      <ul className="mt-2 space-y-1">
                        {player.fieldGoalPositions.map((pos) => (
                          <li key={`fg-${pos.id}`} className="text-sm">
                            {pos.position} - {formatTeamDepth(pos.teamDepth)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Hands Team Positions */}
                  {player.handsPositions && player.handsPositions.length > 0 ? (
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h5 className="font-medium text-red-700">Hands Team</h5>
                      <ul className="mt-2 space-y-1">
                        {player.handsPositions.map((pos) => (
                          <li key={`hands-${pos.id}`} className="text-sm">
                            {pos.position} - {formatTeamDepth(pos.teamDepth)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* No assignments */}
                  {(!player.kickoffPositions ||
                    player.kickoffPositions.length === 0) &&
                    (!player.kickoffReturnPositions ||
                      player.kickoffReturnPositions.length === 0) &&
                    (!player.puntPositions ||
                      player.puntPositions.length === 0) &&
                    (!player.fieldGoalPositions ||
                      player.fieldGoalPositions.length === 0) &&
                    (!player.handsPositions ||
                      player.handsPositions.length === 0) && (
                      <div className="col-span-full text-gray-500 text-sm italic">
                        No special teams assignments found for this player.
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Position preference fields */}
            <div className="sm:col-span-2">
              <label
                htmlFor="fgPosition"
                className="block text-sm font-medium text-gray-700"
              >
                Field Goal Position
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="fgPosition"
                  id="fgPosition"
                  defaultValue={defaultValues.fgPosition}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="koPosition"
                className="block text-sm font-medium text-gray-700"
              >
                Kickoff Position
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="koPosition"
                  id="koPosition"
                  defaultValue={defaultValues.koPosition}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="korPosition"
                className="block text-sm font-medium text-gray-700"
              >
                Kickoff Return Position
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="korPosition"
                  id="korPosition"
                  defaultValue={defaultValues.korPosition}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="puntPosition"
                className="block text-sm font-medium text-gray-700"
              >
                Punt Position
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="puntPosition"
                  id="puntPosition"
                  defaultValue={defaultValues.puntPosition}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-start pt-5">
                <div className="flex h-5 items-center">
                  <input
                    id="handsTeam"
                    name="handsTeam"
                    type="checkbox"
                    defaultChecked={defaultValues.handsTeam}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="handsTeam"
                    className="font-medium text-gray-700"
                  >
                    Hands Team
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {player ? "Update Player" : "Add Player"}
        </button>
      </div>
    </Form>
  );
}
