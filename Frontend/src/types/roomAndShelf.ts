// src/types/location.ts
export interface Room {
    id: number;
    roomCode: string;
    description: string;
}

export interface Shelf {
    id: number;
    shelfCode: string;
    roomId: number;
    room?: Room;
}

// DTOs
export interface CreateRoomDto {
    roomCode: string;
    description: string;
}

export interface CreateShelfDto {
    roomId: number;
    shelfCode: string;
}

export interface UpdateShelfDto {
    roomId: number;
    shelfCode: string;
}