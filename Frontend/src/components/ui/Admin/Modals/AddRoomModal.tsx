'use client';

import React, { useState } from 'react';
import { CreateRoomDto } from '@/src/types/roomAndShelf';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateRoomDto) => Promise<void>;
}

export default function AddRoomModal({ isOpen, onClose, onSubmit }: Props) {
    const [form, setForm] = useState<CreateRoomDto>({ roomCode: '', description: '' });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(form);
        setForm({ roomCode: '', description: '' });
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
                    <h3 className="font-bold text-lg text-amber-950">Yeni Oda Ekle</h3>
                    <button
                        onClick={onClose}
                        className="text-stone-400 hover:text-stone-600 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Oda Kodu / Adı</label>
                        <input
                            type="text" required
                            value={form.roomCode}
                            onChange={e => setForm({...form, roomCode: e.target.value})}
                            className="w-full border border-stone-300 text-black p-2 rounded text-sm outline-none focus:border-amber-500"
                            placeholder="Örn: A-Blok Tarih"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Açıklama</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                            className="w-full border border-stone-300 text-black p-2 rounded text-sm outline-none focus:border-amber-500 resize-none"
                            rows={3}
                            placeholder="Zemin kat, girişin solu..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
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
                            className="px-6 py-2 text-sm bg-amber-900 text-white rounded hover:bg-amber-800 disabled:opacity-50 transition-colors font-medium"
                        >
                            {loading ? 'Kaydediliyor...' : 'Oluştur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}