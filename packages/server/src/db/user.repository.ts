import { v4 as uuidv4 } from 'uuid';
import pool from './index';
import { User, UserDTO, UserResponse } from '@shared/types/user';

export class UserRepository {
    async create(data: UserDTO): Promise<User> {
        const { email, password, nickname } = data;
        const passwordHash = password;
        const id = uuidv4();

        const result = await pool.query(
            `INSERT INTO users (id, email, password_hash, nickname)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, password_hash, nickname, created_at`,
            [id, email, passwordHash, nickname || null]
        );

        console.log(`создан пользователь: ${this.mapToUser(result.rows[0])}`)
        return this.mapToUser(result.rows[0]);
    }

    async findById(id: string): Promise<User> {
        const result = await pool.query(
            `SELECT id, email, password_hash, nickname, created_at
       FROM users WHERE id = $1`,
            [id]
        );

        return this.mapToUser(result.rows[0]);
    }

    async findByEmail(email: string): Promise<User> {
        const result = await pool.query(
            `SELECT id, email, password_hash, nickname, created_at
       FROM users WHERE email = $1`,
            [email]
        );

        return this.mapToUser(result.rows[0]);
    }

    async update(id: string, data: Partial<UserDTO>): Promise<User | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        if (data.nickname !== undefined) {
            fields.push(`nickname = $${paramIndex++}`);
            values.push(data.nickname);
        }

        if (data.password !== undefined) {
            fields.push(`password_hash = $${paramIndex++}`);
            values.push(data.password); // Will be hashed in service
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);

        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, email, password_hash, nickname, created_at`,
            values
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapToUser(result.rows[0]);
    }

    async delete(id: string): Promise<boolean> {
        const result = await pool.query(
            `DELETE FROM users WHERE id = $1`,
            [id]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    async exists(email: string): Promise<boolean> {
        const result = await pool.query(
            `SELECT 1 FROM users WHERE email = $1`,
            [email]
        );

        return result.rows.length > 0;
    }

    private mapToUser(row: Record<string, unknown>): User {
        return {
            id: row.id as string,
            email: row.email as string,
            passwordHash: row.password_hash as string,
            nickname: row.nickname as string | undefined,
            createdAt: row.created_at as string,
        };
    }
}

export const userRepository = new UserRepository();
