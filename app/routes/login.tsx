import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams, Form } from "@remix-run/react";
import { useEffect, useRef } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { verifyLogin, createUserSession, getUser } from "~/utils/auth.server";

interface ActionData {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
    password: string;
  };
}

// If user is already logged in, redirect to home
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return json({});
};

// Validate form fields
function validateEmail(email: string) {
  if (!email || !email.includes("@")) {
    return "Please enter a valid email address";
  }
}

function validatePassword(password: string) {
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") || "/";

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json({ formError: "Invalid form submission" }, { status: 400 });
  }

  const fields = { email, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return json({ fieldErrors, fields }, { status: 400 });
  }

  const user = await verifyLogin(email, password);
  if (!user) {
    return json(
      {
        fields,
        formError: "Invalid email or password",
      },
      { status: 400 }
    );
  }

  return createUserSession(user.id, user.role, redirectTo);
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    if (actionData?.fieldErrors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.fieldErrors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Special Teams Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={actionData?.fields?.email}
                aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                aria-describedby="email-error"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {actionData?.fieldErrors?.email && (
                <p
                  className="text-rose-500 text-xs mt-1"
                  id="email-error"
                  role="alert"
                >
                  {actionData.fieldErrors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                defaultValue={actionData?.fields?.password}
                aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                aria-describedby="password-error"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {actionData?.fieldErrors?.password && (
                <p
                  className="text-rose-500 text-xs mt-1"
                  id="password-error"
                  role="alert"
                >
                  {actionData.fieldErrors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            {actionData?.formError && (
              <p
                className="text-rose-500 text-sm text-center mb-4"
                role="alert"
              >
                {actionData.formError}
              </p>
            )}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
