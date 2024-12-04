/* eslint-disable no-console */ // * Disabling ESLint for console statements, usually for debugging purposes

import { UserRole } from "@prisma/client"; // * Importing UserRole from Prisma to ensure proper role assignments
import bcrypt from "bcryptjs"; // * Importing bcryptjs for password hashing
import config from "../config"; // * Importing configuration settings, such as admin credentials and bcrypt salt rounds
import prisma from "./prisma"; // * Importing Prisma client for database interaction

// !! Function to seed the Super Admin user if not already present in the database
export const seedSuperAdmin = async () => {
  try {
    // * Checking if a Super Admin with the specified email already exists in the database
    const isSuperAdminExists = await prisma.user.findUnique({
      where: {
        role: UserRole.SUPER_ADMIN, // !! Ensuring the role is SUPER_ADMIN
        email: config.admin_email, // !! Ensuring the email is the one specified in the config
      },
    });

    // * If the Super Admin does not exist, proceed with creating a new one
    if (!isSuperAdminExists) {
      // !! Hashing the password using bcrypt with the salt rounds specified in the config
      const hashedPassword = await bcrypt.hash(
        config.admin_password as string, // * Hashing the password provided in the config
        Number(config.bcrypt_salt_rounds) // * Number of salt rounds specified in the config for bcrypt
      );

      // !! Using a Prisma transaction to ensure both user and admin records are created atomically
      await prisma.$transaction(async (tx) => {
        // * Creating the Super Admin user record
        const user = await tx.user.create({
          data: {
            email: config.admin_email as string, // * Admin email from config
            password: hashedPassword, // * Hashed password
            role: UserRole.SUPER_ADMIN, // !! Assigning the SUPER_ADMIN role
          },
        });

        // * Creating the corresponding admin record in the database
        await tx.admin.create({
          data: {
            name: "Super Admin", // * Admin name set to "Super Admin"
            email: user.email, // * Using the created user's email
            profilePhoto: config.admin_profile_photo, // * Admin profile photo from config
          },
        });
      });

      console.log("Super Admin created successfully..."); // * Logging success message if Super Admin creation is successful
      console.log("Seeding completed..."); // * Logging completion of seeding process
    }
  } catch (err) {
    console.log("Error in seeding", err); // * Logging any errors that occur during seeding
  } finally {
    await prisma.$disconnect(); // * Ensuring Prisma client is disconnected after operation
  }
};
