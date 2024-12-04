import { Router } from "express"; // * Importing Router from Express
import { AuthRoutes } from "../modules/auth/auth.route"; // * Importing authentication routes

const router = Router(); // * Initializing the main router

// !! Array to manage module-specific routes
const moduleRouter = [
  {
    path: "/auth", // !! Base path for authentication-related routes
    route: AuthRoutes, // !! Routes defined in the Auth module
  },
];

// !! Dynamically applying all module routes to the main router
moduleRouter.forEach((route) => router.use(route.path, route.route));

// * Exporting the configured router for use in the main application
export default router;
