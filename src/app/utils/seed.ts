import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { UserRole } from "../../generated/prisma/enums";

export const seedSuperAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        id: "admin-user-id",
        name: "Super Admin",
        email: "admin@cineverse.com",
        emailVerified: true,
        role: UserRole.ADMIN,
        status: "ACTIVE",
      },
    });

    // Create account for email/password authentication
    await prisma.account.create({
      data: {
        id: "admin-account-id",
        accountId: "admin@cineverse.com",
        providerId: "credential",
        userId: adminUser.id,
        password: hashedPassword,
      },
    });

  } catch (error) {
    console.error("Error seeding super admin:", error);
  }
};