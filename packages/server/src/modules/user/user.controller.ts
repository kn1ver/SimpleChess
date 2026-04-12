import * as userService from './user.service';

export async function getUserInfo(req: any, res: any) {
    const id = req.body;
    const user = await userService.getUserInfo(id);

    res.status(201).json(user);
}

