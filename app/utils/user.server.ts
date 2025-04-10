import { prisma } from "~/db/prisma.server";
import { hashPassword } from "~/utils/auth.server";
import { Role, User } from "@prisma/client";

export async function getUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(
  email: string,
  username: string,
  password: string,
  role: Role = Role.VIEWER
): Promise<User> {
  const passwordHash = await hashPassword(password);

  return prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      role,
    },
  });
}

export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany({
    orderBy: { username: "asc" },
  });
}

export async function updateUserRole(id: number, role: Role): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
}

export async function changePassword(
  id: number,
  newPassword: string
): Promise<User> {
  const passwordHash = await hashPassword(newPassword);

  return prisma.user.update({
    where: { id },
    data: { passwordHash },
  });
}

// For initial setup - seed admin and viewer users if no users exist
export async function seedUsers(): Promise<void> {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    // Create an admin user
    await createUser("admin@example.com", "admin", "admin123", Role.ADMIN);

    // Create a viewer user
    await createUser("viewer@example.com", "viewer", "viewer123", Role.VIEWER);

    console.log("Created default users:");
    console.log("  Admin: admin@example.com / admin123");
    console.log("  Viewer: viewer@example.com / viewer123");
  }
}
