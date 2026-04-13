import { userRepository } from '../../db/user.repository';
import { UserResponse } from '@shared/types/user';
import { verifyToken } from "../../utils/jwt.utils";

export async function getUserInfo(token: string) {
    const userPayload = await verifyToken(token);
    if (userPayload) {
        const user = await userRepository.findByEmail(userPayload.email)
        const res: UserResponse = {
            id: user?.id,
            email: user?.email,
            nickname: user.nickname,
            createdAt: user.createdAt
        }
        return res
    } else {
        throw new Error('invalid token')
    }
}
