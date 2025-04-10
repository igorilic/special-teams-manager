import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { useState } from "react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { User } from "@prisma/client";

import { prisma } from "~/db/prisma.server";
import { requireAdmin, hashPassword } from "~/utils/auth.server";
import { getUserById } from "~/utils/user.server";

type LoaderData = {
  users: User[];
};

export const loader: LoaderFunction = async ({ request }) => {
  // This route requires admin role
  await requireAdmin(request);

  const users = await prisma.user.findMany({
    orderBy: { username: "asc" },
  });

  return Response.json({ users });
};

type ActionData =
  | {
      error?: string;
      success?: string;
      createError?: string;
    }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  // This route requires admin role
  await requireAdmin(request);

  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "updateRole") {
    const userId = formData.get("userId");
    const role = formData.get("role");

    if (
      typeof userId !== "string" ||
      typeof role !== "string" ||
      !userId ||
      !["ADMIN", "VIEWER"].includes(role)
    ) {
      return Response.json({ error: "Invalid form data" }, { status: 400 });
    }

    const user = await getUserById(parseInt(userId, 10));

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { role: role === "ADMIN" ? "ADMIN" : "VIEWER" },
    });

    return Response.json({ success: "User role updated successfully" });
  }

  if (action === "createUser") {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("newUserRole");

    // Validate inputs
    if (
      typeof username !== "string" ||
      !username.trim() ||
      typeof email !== "string" ||
      !email.includes("@") ||
      typeof password !== "string" ||
      password.length < 6 ||
      typeof role !== "string" ||
      !["ADMIN", "VIEWER"].includes(role)
    ) {
      return Response.json(
        {
          createError:
            "Invalid form data. Ensure all fields are filled correctly and password is at least 6 characters.",
        },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return Response.json(
        {
          createError: "A user with this username or email already exists.",
        },
        { status: 400 }
      );
    }

    // Create new user
    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: role as "ADMIN" | "VIEWER",
      },
    });

    return Response.json({ success: "User created successfully" });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
};

export default function AdminIndex() {
  const { users } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">User Management</h2>
          <button
            type="button"
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            {showAddUserForm ? "Cancel" : "Add New User"}
          </button>
        </div>

        {/* Add User Form */}
        {showAddUserForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Create New User
            </h3>

            {actionData?.createError && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {actionData.createError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Form method="post" className="space-y-4">
              <input type="hidden" name="_action" value="createUser" />

              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      minLength={6}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="newUserRole"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="newUserRole"
                      name="newUserRole"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="VIEWER"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create User
                </button>
              </div>
            </Form>
          </div>
        )}

        {/* Success Messages */}
        {actionData?.success && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  {actionData.success}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {actionData?.error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {actionData.error}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Form method="post" className="inline-flex items-center">
                      <input type="hidden" name="_action" value="updateRole" />
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="mx-1 block border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                      <button
                        type="submit"
                        className="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        Update
                      </button>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            <strong>Note:</strong> ADMIN users can edit players and depth
            charts, while VIEWER users can only view them.
          </p>
        </div>
      </div>
    </div>
  );
}
