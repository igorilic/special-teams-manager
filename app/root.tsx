import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLoaderData,
  Form,
} from "@remix-run/react";
import type {
  LinksFunction,
  // MetaFunction,
  LoaderFunction,
} from "@remix-run/node";
import type { User } from "@prisma/client";

import { getUser, isAdmin, canEdit } from "~/utils/auth.server";
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

// export const meta: MetaFunction = () => ({
//   charset: "utf-8",
//   title: "Special Teams Manager",
//   viewport: "width=device-width,initial-scale=1",
// });

type LoaderData = {
  user: User | null;
  isAdmin: boolean;
  canEdit: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return Response.json({
    user,
    isAdmin: isAdmin(user),
    canEdit: canEdit(user),
  });
};

export default function App() {
  const {
    user,
    isAdmin: userIsAdmin,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canEdit: userCanEdit,
  } = useLoaderData<LoaderData>();

  return (
    <html lang="en" className="h-screen">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-100">
        {user ? (
          <div className="h-screen">
            <nav className="bg-blue-800">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link to="/" className="text-white text-2xl font-bold">
                        Special Teams Manager
                      </Link>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        <Link
                          to="/roster"
                          className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Roster
                        </Link>
                        <Link
                          to="/depth-charts"
                          className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Depth Charts
                        </Link>
                        {userIsAdmin && (
                          <Link
                            to="/admin"
                            className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Admin
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-white text-sm mr-2">
                        {user.username}
                        <span
                          className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${
                            userIsAdmin
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </span>
                      <Form action="/logout" method="post">
                        <button
                          type="submit"
                          className="text-white bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-md text-sm font-medium"
                        >
                          Logout
                        </button>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile menu */}
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  <Link
                    to="/roster"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Roster
                  </Link>
                  <Link
                    to="/depth-charts"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Depth Charts
                  </Link>
                  {userIsAdmin && (
                    <Link
                      to="/admin"
                      className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Admin
                    </Link>
                  )}
                </div>
              </div>
            </nav>

            <main>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <Outlet />
              </div>
            </main>
          </div>
        ) : (
          <Outlet />
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
