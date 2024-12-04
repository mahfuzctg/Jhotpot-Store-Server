/* eslint-disable no-console */ // * Disabling ESLint for console statements
/* eslint-disable @typescript-eslint/no-explicit-any */ // * Disabling TypeScript explicit `any` warning for this file

import { PrismaClient } from "@prisma/client"; // * Importing Prisma Client for database interaction

// !! Creating an instance of Prisma Client with logging configuration
const prisma = new PrismaClient({
  log: [
    {
      emit: "event", // !! Specifies that log events should be emitted
      level: "query", // !! Logs database queries (useful for debugging)
    },
    {
      emit: "event", // !! Specifies that log events should be emitted
      level: "error", // !! Logs errors for immediate attention
    },
    {
      emit: "event", // !! Specifies that log events should be emitted
      level: "info", // !! Logs informational messages about Prisma operations
    },
    {
      emit: "event", // !! Specifies that log events should be emitted
      level: "warn", // !! Logs warnings, indicating potential issues
    },
  ],
});

// * Exporting the configured Prisma client for use throughout the application
export default prisma;
