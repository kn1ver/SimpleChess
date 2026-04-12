import { userRepository } from "../../db/user.repository";
import { User, UserDTO, UserResponse, UserPayload } from '@shared/types/user';
import { config } from '../../config/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


async function hashPassword(password: string): Promise<string> {
    const salt = 10;
    return bcrypt.hash(password, salt);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

async function generateToken(payload: UserPayload): Promise<string> {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: '1h'
    });
}
async function verifyToken(token: string): Promise<UserPayload | null> {
    try {
        return jwt.verify(token, config.JWT_SECRET) as UserPayload;
    } catch {
        return null;
    }
}

export async function register(data: UserDTO): Promise<UserResponse> {
    console.log(data)
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
    const user: User = await userRepository.findByEmail(data.email);

    if (!user) {
        throw new Error('User not found');
    }

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
