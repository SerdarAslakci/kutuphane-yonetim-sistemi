'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Publisher } from '@/src/types/publisherAndAuthor';
import { publisherService } from '@/src/services/publisherService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    publisher: Publisher | null;
    onSuccess: () => void;
}

export default function UpdatePublisherModal({ isOpen, onClose, publisher, onSuccess }: Props) {
    const [name, setName] = useState(publisher?.name || '');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !publisher) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Yayınevi adı boş olamaz.");

        setLoading(true);
        const toastId = toast.loading("Güncelleniyor...");

        try {
            await publisherService.updatePublisher(publisher.id, { name });

            toast.success("Yayınevi güncellendi!", { id: toastId });
            onSuccess();
            onClose();
        } catch (error:any) {
            console.log("Publisher update ederken hata: ",error.response.data);
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
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-11/12 max-w-sm p-6 border border-stone-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-2">
                    <h3 className="font-serif font-bold text-lg text-amber-950">Yayınevi Düzenle</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Yayınevi Adı</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-stone-300 p-2 rounded text-sm outline-none focus:border-amber-500 text-stone-800"
                            placeholder="Örn: İş Bankası Yayınları"
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
                            {loading ? '...' : 'Güncelle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}