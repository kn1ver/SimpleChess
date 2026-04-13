import { userRepository } from "../../db/user.repository";
import { User, UserDTO, UserResponse, UserPayload } from '@shared/types/user';
import { generateToken } from "../../utils/jwt.utils";
import bcrypt from 'bcrypt';



async function hashPassword(password: string): Promise<string> {
    const salt = 10;
    return bcrypt.hash(password, salt);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function register(data: UserDTO): Promise<UserResponse> {
    const userExists = await userRepository.exists(data.email);
    if (userExists) { throw new Error('Email is already registered'); }

    const password = await hashPassword(data.password);
    data.password = password;

    const user: User = await userRepository.create(data);
    const res: UserResponse = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt
    }
    return res
}

export async function login(data: UserDTO): Promise<string> {
    const userExists = await userRepository.exists(data.email);
    if (!userExists) {
        throw new Error('User not found');
    }

    const user: User = await userRepository.findByEmail(data.email);
    const isValidPass = await verifyPassword(data.password, user.passwordHash);
    if (!isValidPass) {
        throw new Error('Invalid password');
    }

    const payload: UserPayload = {
        id: user.id,
        email: user.email
    }
    return await generateToken(payload);
}
