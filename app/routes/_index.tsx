import { Link } from "@remix-run/react";
import { TEAMS } from "~/utils/positions";

export default function Index() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Special Teams Manager
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your football team&apos;s special teams rosters and depth
          charts
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/roster"
          className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center"
        >
          <div className="text-blue-800 text-3xl mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Player Roster</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage players and their information
          </p>
        </Link>

        <Link
          to="/depth-charts"
          className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center"
        >
          <div className="text-blue-800 text-3xl mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Depth Charts</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage special teams depth charts
          </p>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Special Teams</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(TEAMS).map((team) => {
            const teamSlug = team.toLowerCase().replace(/\s+/g, "-");
            console.debug(team, teamSlug);
            return (
              <Link
                key={team}
                to={`/depth-charts/${teamSlug}`}
                className="bg-white border border-gray-200 hover:border-blue-500 p-4 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-medium text-gray-900">{team}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Manage {team.toLowerCase()} team personnel and depth
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
