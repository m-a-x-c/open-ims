import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import verifyAuth from '../../middlewares/verifyAuth';
import saleValidator from './sale.validator';
import saleControllers from './sale.controllers';

const saleRoutes = Router();

saleRoutes.use(verifyAuth);

saleRoutes.post('/', validateRequest(saleValidator.createSchema), saleControllers.create);
saleRoutes.get('/', saleControllers.readAll);
saleRoutes.patch('/:id', validateRequest(saleValidator.updateSchema), saleControllers.update);
saleRoutes.get('/:id', saleControllers.readSingle);
saleRoutes.delete('/:id', saleControllers.delete);

export default saleRoutes;
