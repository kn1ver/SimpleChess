import { UserPayload } from '@shared/types/user';
import { config } from '../config/index';
import jwt from 'jsonwebtoken';


export async function generateToken(payload: UserPayload): Promise<string> {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: '1h'
    });
}
export async function verifyToken(token: string): Promise<UserPayload | null> {
    try {
        return jwt.verify(token, config.JWT_SECRET) as UserPayload;
    } catch {
        return null;
    }
}
