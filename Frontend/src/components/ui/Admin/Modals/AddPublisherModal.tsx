'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CreatePublisherDto } from '@/src/types/publisherAndAuthor';
import { publisherService } from '@/src/services/publisherService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddPublisherModal({ isOpen, onClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Yayınevi adı zorunludur.");

        setLoading(true);
        const toastId = toast.loading("Yayınevi ekleniyor...");

        try {
            await publisherService.createPublisher({ name });
            toast.success("Yayınevi eklendi!", { id: toastId });
            setName('');
            onSuccess();
            onClose();
        } catch (error:any) {
            console.error("Publisher eklerken hata: ", error.response.data);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h3 className="font-serif font-bold text-lg text-amber-950 mb-4">Yeni Yayınevi Ekle</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Yayınevi Adı</label>
                        <input
                            type="text" value={name} onChange={e => setName(e.target.value)}
                            className="w-full border text-black p-2 rounded text-sm outline-none focus:border-amber-500"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded">İptal</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-amber-900 text-white rounded hover:bg-amber-800 disabled:opacity-50">
                            {loading ? '...' : 'Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}