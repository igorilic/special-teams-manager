import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { prisma } from "~/db/prisma.server";
import type { User } from "@prisma/client";

// Session management with cookie storage
const sessionSecret =
  process.env.SESSION_SECRET || "special-teams-session-secret";

const storage = createCookieSessionStorage({
  cookie: {
    name: "special_teams_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

// Create user session
export async function createUserSession(
  userId: number,
  role: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  session.set("role", role);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Get user session
export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// Get logged in user
export async function getUser(request: Request): Promise<User | null> {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch {
    return null;
  }
}

// Logout user
export async function logout(request: Request) {
  const session = await getUserSession(request);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

// Verify login
export async function verifyLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  return user;
}

// Hash password
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// Authorization Guards

// Require authentication
export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const user = await getUser(request);

  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return user;
}

// Require admin role
export async function requireAdmin(request: Request) {
  const user = await requireUser(request);

  if (user.role !== "ADMIN") {
    throw new Response("Forbidden: Admin access required", { status: 403 });
  }

  return user;
}

// Check if user is admin
export function isAdmin(user: User | null) {
  if (!user) return false;
  return user.role === "ADMIN";
}

// UI helpers for showing/hiding elements based on role
export function canEdit(user: User | null) {
  return isAdmin(user);
}
