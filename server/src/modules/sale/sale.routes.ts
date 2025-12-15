import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import verifyAuth from '../../middlewares/verifyAuth';
import saleValidator from './sale.validator';
import saleControllers from './sale.controllers';

const saleRoutes = Router();

saleRoutes.use(verifyAuth);

saleRoutes.post('/', validateRequest(saleValidator.createSchema), saleControllers.create);

export default saleRoutes;
