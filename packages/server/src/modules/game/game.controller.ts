import * as gameService from './game.service'

export async function create(req: any, res: any, next: any) {
    try {
        const user = await gameService.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export async function getGames(req: any, res: any, next: any) {
    try {
        const user = await gameService.getGames(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}
