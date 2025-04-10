import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

// Logout action
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

// Redirect to home if someone visits this route directly
export const loader: LoaderFunction = async () => {
  return redirect("/");
};
