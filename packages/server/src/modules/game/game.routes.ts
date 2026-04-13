import { Router } from 'express';
import * as gameController from './game.controller'

const router = Router();

router.post('/create', gameController.create);
router.post('/games', gameController.getGames);

export default router
