import * as authService from './auth.service';

export async function register(req: any, res: any, next: any) {
    try {
        const user = await authService.register(req.body);
        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export async function login(req: any, res: any, next: any) {
    try {
        const token = await authService.login(req.body);
        return res.json({ token });
    } catch (error) {
        next(error);
    }
}

