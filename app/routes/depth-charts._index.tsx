import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import type { User } from "@prisma/client";

import { getUser, isAdmin, canEdit } from "~/utils/auth.server";
import DepthChartSelector from "~/components/DepthChartSelector";

type LoaderData = {
  user: User | null;
  isAdmin: boolean;
  canEdit: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }

  return Response.json({
    user,
    isAdmin: isAdmin(user),
    canEdit: canEdit(user),
  });
};

export default function DepthChartsIndex() {
  const { canEdit: userCanEdit } = useLoaderData<LoaderData>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Special Teams Depth Charts
        </h1>

        {!userCanEdit && (
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm">
            View Only Mode
          </div>
        )}
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <p className="text-gray-700 mb-6">
          Select a special teams unit to view {userCanEdit ? "and manage" : ""}{" "}
          its depth chart.
        </p>

        <DepthChartSelector />
      </div>
    </div>
  );
}
