'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { bookService } from '@/src/services/bookService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    bookId: number;
    bookTitle: string;
    onSuccess: () => void;
}


export default function DeleteConfirmationModal({ isOpen, onClose, bookId, bookTitle, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setLoading(true);
        const toastId = toast.loading("Siliniyor...");
        try {
            await bookService.deleteBook(bookId);
            toast.success("Kitap silindi.", { id: toastId });
            onSuccess();
            onClose();
        } catch (error:any) {
            console.error("Kategori eklenemedi", error.response.data);
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 border border-red-100" onClick={e => e.stopPropagation()}>
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
                    <h3 className="font-bold text-lg text-stone-800 mb-2">Emin misiniz?</h3>
                    <p className="text-stone-500 text-sm mb-6">
                        <span className="font-bold text-stone-800">{bookTitle}</span> adlı kitabı silmek üzeresiniz. Tüm kitap kopyaları da silinecektir. Bu işlem geri alınamaz.
                    </p>

                    <div className="flex justify-center gap-3">
                        <button onClick={onClose} className="px-4 py-2 border border-stone-300 rounded text-stone-600 hover:bg-stone-50 text-sm">İptal</button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold shadow-sm"
                        >
                            {loading ? 'Siliniyor...' : 'Evet, Sil'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}