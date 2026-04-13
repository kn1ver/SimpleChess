export type GameStatus = 
    | 'waiting' 
    | 'playing' 
    | 'checkmate' 
    | 'draw' 
    | 'stalemate' 
    | 'resign';

export interface Game {
    id: string;
    white_id: string;
    black_id: string;
    fen: string;
    pgn: string;
    status: GameStatus;
    clock_white: number;
    clock_black: number;
    winner: string | null;
    created_at: string;
}

export interface GameDB {
    id: string;
    white_id: string;
    black_id: string;
    pgn?: string;
    status: GameStatus;
    winner?: string | null;
    created_at: string;
}

export interface GameCache {
    id: string;
    white_id: string;
    black_id: string;
    fen: string;
    turn: 'white' | 'black';
    clock_white: number | null;
    clock_black: number | null;
    status: GameStatus;
    lastMove?: string;
}

export interface GameCreateDTO {
    white_id?: string;
    black_id?: string;
    clockTime?: number;
}

export interface GameResponse {
    id: string;
    status: GameStatus;
    white_id: string;
    black_id: string | null;
    fen: string;
    turn: 'white' | 'black';
    clock_white: number | null;
    clock_black: number | null;
    winner: string | null;
    created_at: string;
}