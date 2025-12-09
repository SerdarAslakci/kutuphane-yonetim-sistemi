'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    entityId: number | string;
    entityName: string;
    entityType: string;
    onDeleteService: (id: any) => Promise<any>;
    onSuccess: () => void;
}

export default function GenericDeleteModal({
                                               isOpen,
                                               onClose,
                                               entityId,
                                               entityName,
                                               entityType,
                                               onDeleteService,
                                               onSuccess
                                           }: Props) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setLoading(true);
        const toastId = toast.loading(`${entityType} siliniyor...`);

        try {
            // Dinamik olarak gelen servis fonksiyonunu çağırıyoruz
            await onDeleteService(entityId);

            toast.success(`${entityType} başarıyla silindi.`, { id: toastId });
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Kategori silme hatasi: ", error.response.data);
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
                className="bg-white rounded-lg shadow-xl w-11/12 max-w-sm p-6 border border-red-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ⚠️
                    </div>

                    <h3 className="font-bold text-lg text-stone-800 mb-2">
                        {entityType} Silinecek
                    </h3>

                    <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                        <span className="font-bold text-stone-800 break-words">"{entityName}"</span> adlı kaydı silmek üzeresiniz. İlişkili tüm veriler de silinecektir.
                        Bu işlem geri alınamaz.
                    </p>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-stone-300 rounded text-stone-600 hover:bg-stone-50 text-sm transition-colors w-full sm:w-auto"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            {loading && <span className="animate-spin text-white">↻</span>}
                            {loading ? 'Siliniyor...' : 'Evet, Sil'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}