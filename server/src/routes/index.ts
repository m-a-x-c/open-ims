import { Router } from 'express';
import userRoutes from '../modules/user/user.routes';
import sellerRoutes from '../modules/seller/seller.routes';
import categoryRoutes from '../modules/category/category.routes';
import brandRoutes from '../modules/brand/brand.routes';

const rootRouter = Router();

rootRouter.use('/users', userRoutes);
rootRouter.use('/sellers', sellerRoutes);
rootRouter.use('/categories', categoryRoutes);
rootRouter.use('/brands', brandRoutes);

export default rootRouter;
