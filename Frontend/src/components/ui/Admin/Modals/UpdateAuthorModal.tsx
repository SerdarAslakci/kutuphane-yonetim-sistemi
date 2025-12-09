'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Author, UpdateAuthorDto } from '@/src/types/publisherAndAuthor';
import { authorService } from '@/src/services/authorService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    author: Author | null;
}

export default function UpdateAuthorModal({ isOpen, onClose, onSuccess, author }: Props) {
    const [form, setForm] = useState<UpdateAuthorDto>({ id: 0, firstName: '', lastName: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (author) {
            setForm({ id: author.id, firstName: author.firstName, lastName: author.lastName });
        }
    }, [author, isOpen]);

    if (!isOpen || !author) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName || !form.lastName) {
            return toast.error("Ad ve Soyad zorunludur.");
        }

        setLoading(true);
        const toastId = toast.loading("Güncelleniyor...");

        try {
            await authorService.updateAuthor(form);
            toast.success("Yazar başarıyla güncellendi!", { id: toastId });
            onSuccess()
            onClose();
        } catch (error:any) {
            toast.error(error.response.data, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <h3 className="font-serif font-bold text-lg text-amber-950 mb-4">Yazar Düzenle</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Ad</label>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={e => setForm({...form, firstName: e.target.value})}
                            className="w-full border text-black p-2 rounded text-sm outline-none focus:border-amber-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Soyad</label>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={e => setForm({...form, lastName: e.target.value})}
                            className="w-full border text-black p-2 rounded text-sm outline-none focus:border-amber-500"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-stone-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded">İptal</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-amber-900 text-white rounded hover:bg-amber-800 disabled:opacity-50">
                            {loading ? '...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}