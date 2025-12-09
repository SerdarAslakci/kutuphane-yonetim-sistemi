import React, { useState, useEffect } from 'react';
import { CreateRoomDto, Room } from '@/src/types/roomAndShelf';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
    onSubmit: (id: number, data: CreateRoomDto) => Promise<void>;
}

export default function UpdateRoomModal({ isOpen, onClose, room, onSubmit }: Props) {
    const [form, setForm] = useState<CreateRoomDto>({ roomCode: '', description: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (room) {
            setForm({ roomCode: room.roomCode, description: room.description });
        }
    }, [room, isOpen]);

    if (!isOpen || !room) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(room.id, form);
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
                    <h3 className="font-bold text-lg text-amber-950">Odayı Düzenle</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Oda Kodu</label>
                        <input
                            type="text" required value={form.roomCode}
                            onChange={e => setForm({...form, roomCode: e.target.value})}
                            className="w-full border border-stone-300 p-2 rounded text-sm text-black outline-none focus:border-amber-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Açıklama</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                            className="w-full border border-stone-300 p-2 rounded text-sm text-black outline-none focus:border-amber-500 resize-none"
                            rows={3}
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
                            className="px-4 py-2 text-sm bg-amber-900 text-white rounded hover:bg-amber-800 disabled:opacity-50 transition-colors"
                        >
                            {loading ? '...' : 'Güncelle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}