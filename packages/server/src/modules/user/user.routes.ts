import { Router } from 'express';
import * as userController from './user.controller'

const router = Router();

router.get('/me', userController.getUserInfo);

export default router
