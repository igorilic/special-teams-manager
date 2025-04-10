import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database...");

  // Check if there are any users
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    // Create default admin user
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        username: "admin",
        passwordHash: adminPasswordHash,
        role: Role.ADMIN,
      },
    });

    console.log("Created default admin user:");
    console.log("  Email: admin@example.com");
    console.log("  Password: admin123");

    // Create a viewer user for demonstration
    const viewerPasswordHash = await bcrypt.hash("viewer123", 10);
    await prisma.user.create({
      data: {
        email: "viewer@example.com",
        username: "viewer",
        passwordHash: viewerPasswordHash,
        role: Role.VIEWER,
      },
    });

    console.log("Created demo viewer user:");
    console.log("  Email: viewer@example.com");
    console.log("  Password: viewer123");
  } else {
    console.log("Users already exist, skipping user seed");
  }

  console.log("Database seeding completed");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
