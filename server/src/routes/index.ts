import { Router } from 'express';
import userRoutes from '../modules/user/user.routes';
import sellerRoutes from '../modules/seller/seller.routes';
import categoryRoutes from '../modules/category/category.routes';
import brandRoutes from '../modules/brand/brand.routes';
import productRoute from '../modules/product/product.routes';
import saleRoutes from '../modules/sale/sale.routes';
import purchaseRoutes from '../modules/purchase/purchase.routes';

const rootRouter = Router();

rootRouter.use('/users', userRoutes);
rootRouter.use('/sellers', sellerRoutes);
rootRouter.use('/categories', categoryRoutes);
rootRouter.use('/brands', brandRoutes);
rootRouter.use('/products', productRoute);
rootRouter.use('/sales', saleRoutes);
rootRouter.use('/purchases', purchaseRoutes);

export default rootRouter;
