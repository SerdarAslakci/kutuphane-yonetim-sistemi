'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CreateAuthorDto } from '@/src/types/publisherAndAuthor';
import { authorService } from '@/src/services/authorService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Listeyi yenilemek için
}

export default function AddAuthorModal({ isOpen, onClose, onSuccess }: Props) {
    const [form, setForm] = useState<CreateAuthorDto>({ firstName: '', lastName: '' });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName || !form.lastName) {
            toast.error("Ad ve Soyad zorunludur.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Yazar ekleniyor...");

        try {
            await authorService.createAuthor(form);
            toast.success("Yazar eklendi!", { id: toastId });
            setForm({ firstName: '', lastName: '' });
            onSuccess(); // Listeyi yenile
            onClose();   // Modalı kapat
        } catch (error:any) {
            toast.error(error.response.data, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            {/* Responsive Genişlik: w-11/12 (Mobilde ekranın %92'si), max-w-md (Masaüstünde sınırlı) */}
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6" onClick={e => e.stopPropagation()}>

                <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-2">
                    <h3 className="font-serif font-bold text-lg text-amber-950">Yeni Yazar Ekle</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Ad</label>
                        <input
                            type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                            className="w-full border text-black p-2 rounded text-sm outline-none focus:border-amber-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Soyad</label>
                        <input
                            type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                            className="w-full border text-black p-2 rounded text-sm outline-none focus:border-amber-500"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded transition-colors">İptal</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 text-sm bg-amber-900 text-white rounded hover:bg-amber-800 disabled:opacity-50 transition-colors font-medium">
                            {loading ? '...' : 'Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}