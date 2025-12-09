'use client';

import React, { useState, useEffect } from 'react';
import { Room, Shelf } from '@/src/types/roomAndShelf';
import { roomService } from '@/src/services/roomService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    shelf: Shelf | null;
    currentRoomId: number;
    onSubmit: (id: number, data: { roomId: number, shelfCode: string }) => Promise<void>;
}

export default function UpdateShelfModal({ isOpen, onClose, shelf, currentRoomId, onSubmit }: Props) {
    const [shelfCode, setShelfCode] = useState('');
    const [roomId, setRoomId] = useState(currentRoomId);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            roomService.getRooms().then(setRooms).catch(console.error);
        }
    }, [isOpen]);

    useEffect(() => {
        if (shelf) {
            setShelfCode(shelf.shelfCode);
            setRoomId(shelf.roomId || currentRoomId);
        }
    }, [shelf, currentRoomId, isOpen]);

    if (!isOpen || !shelf) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(shelf.id, { roomId, shelfCode });
        setLoading(false);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-11/12 max-w-sm p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-amber-950">Rafı Düzenle</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Bulunduğu Oda</label>
                        <select
                            value={roomId}
                            onChange={e => setRoomId(Number(e.target.value))}
                            className="w-full border border-stone-300 p-2 rounded text-sm text-black outline-none focus:border-amber-500 bg-white"
                        >
                            {rooms.map(r => (
                                <option key={r.id} value={r.id}>{r.roomCode}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Raf Kodu</label>
                        <input
                            type="text" required value={shelfCode}
                            onChange={e => setShelfCode(e.target.value)}
                            className="w-full border border-stone-300 p-2 rounded text-sm text-black outline-none focus:border-amber-500"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-stone-800 text-white rounded hover:bg-stone-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? '...' : 'Güncelle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}