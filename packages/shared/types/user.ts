export interface User {
    id: string;
    email: string;
    passwordHash: string;
    nickname?: string;
    createdAt: string;
}

export interface UserDTO {
    email: string;
    password: string;
    nickname?: string;
}

export interface UserResponse {
    id: string;
    email: string;
    nickname?: string;
    createdAt: string;
}

export interface UserPayload {
    id: string,
    email: string
}
