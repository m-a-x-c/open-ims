import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import productValidator from './product.validator';
import productControllers from './product.controllers';
import verifyAuth from '../../middlewares/verifyAuth';

const productRoute = Router();

productRoute.use(verifyAuth);

productRoute.get('/total', productControllers.getTotalProduct);
productRoute.post('/', validateRequest(productValidator.createSchema), productControllers.create);
productRoute.get('/', productControllers.readAll);
productRoute.get('/:id', productControllers.readSingle);

export default productRoute;
