import { Router } from 'express';
import userRoutes from '../modules/user/user.routes';
import sellerRoutes from '../modules/seller/seller.routes';

const rootRouter = Router();

rootRouter.use('/users', userRoutes);
rootRouter.use('/sellers', sellerRoutes);

export default rootRouter;
