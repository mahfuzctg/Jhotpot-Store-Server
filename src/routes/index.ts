import { Router } from 'express';
import { CouponRoutes } from '../modules/Coupon/coupon.route';
import { OrderRoutes } from '../modules/Orders/order.route';
import { PaymentRoutes } from '../modules/Payments/payment.route';
import { RecentViewProductRoutes } from '../modules/Recent/recentProduct.route';
import { ProductRoutes } from '../modules/products/product.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { UserRoutes } from '../modules/users/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';


const router = Router();

const moduleRouter = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/recent-products',
    route: RecentViewProductRoutes,
  },
  {
    path: '/coupons',
    route: CouponRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;