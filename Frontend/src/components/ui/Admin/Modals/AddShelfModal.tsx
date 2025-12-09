'use client';

import React, { useState } from 'react';
import { Room } from '@/src/types/roomAndShelf';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedRoom: Room | null;
    onSubmit: (shelfCode: string) => Promise<void>;
}

export default function AddShelfModal({ isOpen, onClose, selectedRoom, onSubmit }: Props) {
    const [shelfCode, setShelfCode] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !selectedRoom) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(shelfCode);
        setShelfCode('');
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
                    <h3 className="font-bold text-lg text-amber-950">Yeni Raf Ekle</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">&times;</button>
                </div>

                <div className="bg-amber-50 p-3 rounded text-xs text-amber-900 mb-4 border border-amber-100">
                    <strong className="block mb-1">Seçili Oda:</strong>
                    {selectedRoom.roomCode}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Raf Kodu</label>
                        <input
                            type="text" required
                            value={shelfCode}
                            onChange={e => setShelfCode(e.target.value)}
                            className="w-full border border-stone-300 text-black p-2 rounded text-sm outline-none focus:border-amber-500"
                            placeholder="Örn: R-101"
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
                            {loading ? 'Ekleniyor...' : 'Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}