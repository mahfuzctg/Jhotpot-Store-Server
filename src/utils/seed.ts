/* eslint-disable no-console */
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../config";
import prisma from "./prisma";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await prisma.user.findUnique({
      where: {
        role: UserRole.SUPER_ADMIN,
        email: config.admin_email,
      },
    });

    if (!isSuperAdminExists) {
      const hashedPassword = await bcrypt.hash(
        config.admin_password as string,
        Number(config.bcrypt_salt_rounds)
      );

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: config.admin_email as string,
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
          },
        });

        await tx.admin.create({
          data: {
            name: "Super Admin",
            email: user.email,
            profilePhoto: config.admin_profile_photo,
          },
        });
      });

      console.log("Super Admin created successfully...");
      console.log("Seeding completed...");
    }
  } catch (err) {
    console.log("Error in seeding", err);
  } finally {
    await prisma.$disconnect();
  }
};
