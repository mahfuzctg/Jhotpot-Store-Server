import { Router } from "express"; // * Importing Router from Express
import { AuthRoutes } from "../modules/auth/auth.route"; // * Importing authentication routes
import { CategoryRoutes } from "../modules/category/category.route";
import { ProductRoutes } from "../modules/products/product.route";
import { UserRoutes } from "../modules/users/user.route";
import { RecentViewProductRoutes } from "../modules/Recent/recentProduct.route";

const router = Router(); // * Initializing the main router

const moduleRouter = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: '/recent-products',
    route: RecentViewProductRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));
// * Exporting the configured router for use in the main application
export default router;
