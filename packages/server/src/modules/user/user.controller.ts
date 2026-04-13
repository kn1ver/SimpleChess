import * as userService from './user.service';

export async function getUserInfo(req: any, res: any) {
    if (!req.body) {
        return res.status(401).json({
            error: {
                message: 'invalid token',
                status: 401
            }
        });
    }
    const user = await userService.getUserInfo(req.body);
    return res.status(201).json(user);
}

