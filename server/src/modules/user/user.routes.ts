import { Router } from 'express';
import userControllers from './user.controllers';
import validateRequest from '../../middlewares/validateRequest';
import userValidator from './user.validator';

const userRoutes = Router();

userRoutes.post('/register', validateRequest(userValidator.registerSchema), userControllers.register);

export default userRoutes;
