'use client';

import React from 'react';
import { Room } from '@/src/types/roomAndShelf';

interface Props {
    rooms: Room[];
    selectedRoom: Room | null;
    loading: boolean;
    onSelectRoom: (room: Room) => void;
    onEditClick: (room: Room) => void;
    onAddClick: () => void;
}

export default function RoomListPanel({ rooms, selectedRoom, onEditClick, loading, onSelectRoom, onAddClick }: Props) {
    return (
        <div className="flex flex-col bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50 shrink-0">
                <h3 className="font-bold text-amber-950 text-sm md:text-base">Odalar / Salonlar</h3>
                <button
                    onClick={onAddClick}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1 rounded text-xs font-bold transition-colors"
                >
                    + Oda Ekle
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-stone-200">
                {loading && <p className="text-center text-stone-400 text-sm p-4">Yükleniyor...</p>}

                {!loading && rooms.map(room => (
                    <div
                        key={room.id}
                        onClick={() => onSelectRoom(room)}
                        className={`
                            p-3 rounded-md cursor-pointer border transition-all relative group
                            ${selectedRoom?.id === room.id
                            ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300 shadow-sm'
                            : 'bg-white border-stone-100 hover:bg-stone-50'}
                        `}
                    >
                        <div className="flex justify-between items-center">
                            <span className={`font-bold text-sm md:text-base ${selectedRoom?.id === room.id ? 'text-amber-900' : 'text-stone-800'}`}>
                                {room.roomCode}
                            </span>

                            <button
                                onClick={(e) => { e.stopPropagation(); onEditClick(room); }}
                                className="opacity-100 md:opacity-0 group-hover:opacity-100 bg-stone-200 hover:bg-amber-200 text-stone-600 p-1.5 rounded text-xs transition-all"
                                title="Düzenle"
                            >
                                ✏️
                            </button>
                        </div>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-1">{room.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}