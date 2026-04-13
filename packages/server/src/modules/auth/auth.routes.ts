import { Router } from 'express';
import * as authController from './auth.controller'
import { registerMiddleware, loginMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', registerMiddleware, authController.register);
router.post('/login', loginMiddleware, authController.login)

export default router
