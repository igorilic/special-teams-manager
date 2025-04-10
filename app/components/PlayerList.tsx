import { useState } from "react";
import { Link, Form } from "@remix-run/react";
import type {
  Player,
  KickoffDepth,
  KickoffReturnDepth,
  PuntDepth,
  FieldGoalDepth,
  HandsDepth,
} from "@prisma/client";

interface PlayerListProps {
  players: (Player & {
    kickoffPositions?: KickoffDepth[];
    kickoffReturnPositions?: KickoffReturnDepth[];
    puntPositions?: PuntDepth[];
    fieldGoalPositions?: FieldGoalDepth[];
    handsPositions?: HandsDepth[];
  })[];
  canEdit?: boolean;
}

export default function PlayerList({
  players,
  canEdit = true,
}: PlayerListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter players based on search term
  const filteredPlayers = players.filter(
    (player) =>
      player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.primaryPosition &&
        player.primaryPosition.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Player Roster</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-8 sm:text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {canEdit && (
            <Link
              to="/roster/new"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Player
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Position
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Height
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Weight
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                40yd
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Special Teams
              </th>
              {canEdit && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td
                  colSpan={canEdit ? 7 : 6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No players found
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {canEdit ? (
                      <Link
                        to={`/roster/${player.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {player.firstName} {player.lastName}
                      </Link>
                    ) : (
                      `${player.firstName} ${player.lastName}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.primaryPosition || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.height || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.weight ? `${player.weight} lbs` : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.fortyTime ? player.fortyTime.toFixed(2) : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {/* Basic position preferences */}
                      {player.fgPosition && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          FG: {player.fgPosition}
                        </span>
                      )}
                      {player.koPosition && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          KO: {player.koPosition}
                        </span>
                      )}
                      {player.korPosition && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          KOR: {player.korPosition}
                        </span>
                      )}
                      {player.puntPosition && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          PUNT: {player.puntPosition}
                        </span>
                      )}
                      {player.handsTeam && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          HANDS
                        </span>
                      )}

                      {/* Depth chart assignments */}
                      {player.kickoffPositions &&
                        player.kickoffPositions.map((pos) => (
                          <span
                            key={`ko-${pos.id}`}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            title={`Kickoff: ${pos.position} (${
                              pos.teamDepth === 1
                                ? "1st"
                                : pos.teamDepth === 2
                                ? "2nd"
                                : "3rd"
                            } team)`}
                          >
                            KO({pos.position}){pos.teamDepth}
                          </span>
                        ))}

                      {player.kickoffReturnPositions &&
                        player.kickoffReturnPositions.map((pos) => (
                          <span
                            key={`kor-${pos.id}`}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                            title={`Kickoff Return: ${pos.position} (${
                              pos.teamDepth === 1
                                ? "1st"
                                : pos.teamDepth === 2
                                ? "2nd"
                                : "3rd"
                            } team)`}
                          >
                            KOR({pos.position}){pos.teamDepth}
                          </span>
                        ))}

                      {player.puntPositions &&
                        player.puntPositions.map((pos) => (
                          <span
                            key={`punt-${pos.id}`}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                            title={`Punt: ${pos.position} (${
                              pos.teamDepth === 1
                                ? "1st"
                                : pos.teamDepth === 2
                                ? "2nd"
                                : "3rd"
                            } team)`}
                          >
                            P({pos.position}){pos.teamDepth}
                          </span>
                        ))}

                      {player.fieldGoalPositions &&
                        player.fieldGoalPositions.map((pos) => (
                          <span
                            key={`fg-${pos.id}`}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                            title={`Field Goal: ${pos.position} (${
                              pos.teamDepth === 1
                                ? "1st"
                                : pos.teamDepth === 2
                                ? "2nd"
                                : "3rd"
                            } team)`}
                          >
                            FG({pos.position}){pos.teamDepth}
                          </span>
                        ))}

                      {player.handsPositions &&
                        player.handsPositions.map((pos) => (
                          <span
                            key={`hands-${pos.id}`}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                            title={`Hands: ${pos.position} (${
                              pos.teamDepth === 1
                                ? "1st"
                                : pos.teamDepth === 2
                                ? "2nd"
                                : "3rd"
                            } team)`}
                          >
                            H({pos.position}){pos.teamDepth}
                          </span>
                        ))}
                    </div>
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link
                          to={`/roster/${player.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <Form method="post" className="inline">
                          <input type="hidden" name="_method" value="delete" />
                          <input
                            type="hidden"
                            name="playerId"
                            value={player.id}
                          />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              if (
                                !confirm(
                                  "Are you sure you want to delete this player?"
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Delete
                          </button>
                        </Form>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
