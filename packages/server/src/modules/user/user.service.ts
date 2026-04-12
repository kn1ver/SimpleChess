import { userRepository } from '../../db/user.repository';
import { UserResponse } from '@shared/types/user';

export async function getUserInfo(id: string) {
    const user = await userRepository.findById(id);
    if (user) {
        const res: UserResponse = {
            id: user?.id,
            email: user?.email,
            nickname: user.nickname,
            createdAt: user.createdAt
        }
        return res
    }
    return null
}
