'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { loanService } from '@/src/services/loanService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    bookTitle: string;
    onSuccess: () => void;
}

export default function BorrowBookModal({ isOpen, onClose, bookTitle, onSuccess }: Props) {
    const today = new Date().toISOString().split('T')[0];

    const defaultEnd = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [inputBarcode, setInputBarcode] = useState('');
    const [startDate] = useState(today);
    const [endDate, setEndDate] = useState(defaultEnd);
    const [loading, setLoading] = useState(false);

    const [maxEndDate, setMaxEndDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            setInputBarcode('');
            setEndDate(defaultEnd);
        }
    }, [isOpen, today, defaultEnd]);

    useEffect(() => {
        const start = new Date(today);
        const maxDate = new Date(start.getTime() + 20 * 24 * 60 * 60 * 1000);
        setMaxEndDate(maxDate.toISOString().split('T')[0]);

        if (new Date(endDate) > maxDate) {
            setEndDate(maxDate.toISOString().split('T')[0]);
        }
    }, [today, endDate]);

    if (!isOpen) return null;

    const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^\d*$/.test(val)) {
            setInputBarcode(val);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading("Girişler kontrol ediliyor...");

        if (!inputBarcode.trim()) {
            return toast.error("Lütfen barkod numarasını giriniz.", { id: toastId });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return toast.error("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.", { id: toastId });
        }

        const diffInMs = end.getTime() - start.getTime();
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays > 20) {
            return toast.error("Maksimum ödünç süresi 20 gündür.", { id: toastId });
        }
        setLoading(true);
        toast.loading("Ödünç verme işlemi yapılıyor...", { id: toastId });

        try {
            await loanService.createLoan({
                barcode: inputBarcode.trim(),
                loanDays: diffInDays
            });

            toast.success("Kitap başarıyla ödünç verildi!", { id: toastId });
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Kitap ödünç verilemedi", error.response?.data);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı.", { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 border border-stone-200" onClick={e => e.stopPropagation()}>

                <div className="mb-6 border-b border-stone-100 pb-2">
                    <h3 className="font-serif font-bold text-xl text-amber-950">Ödünç Ver</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-1">{bookTitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Barkod Numarası</label>
                        <input
                            type="text"
                            required
                            autoFocus
                            inputMode="numeric"
                            value={inputBarcode}
                            onChange={handleBarcodeChange}
                            placeholder="Kitap barkodunu giriniz..."
                            className="w-full border border-stone-300 text-stone-800 rounded p-2.5 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Başlangıç Tarihi</label>
                        <input
                            type="date"
                            readOnly
                            value={startDate}
                            className="w-full border border-stone-300 bg-stone-100 text-stone-500 rounded p-2 text-sm focus:outline-none cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Bitiş Tarihi (Maks. 20 Gün)</label>
                        <input
                            type="date"
                            required
                            min={today}
                            max={maxEndDate}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border border-stone-300 text-stone-800 rounded p-2 text-sm focus:border-amber-500 outline-none"
                        />
                        <p className="text-[10px] text-stone-400 mt-1">En fazla {maxEndDate.split('-').reverse().join('.')} tarihine kadar seçilebilir.</p>
                    </div>

                    {endDate && new Date(endDate) > new Date(startDate) && (
                        <div className={`text-xs p-2 rounded border text-center ${
                            Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) > 20
                                ? 'bg-red-50 text-red-700 border-red-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                            Süre: <strong>{Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}</strong> Gün
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-black hover:bg-stone-100 rounded font-medium transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm bg-amber-900 text-white rounded font-bold hover:bg-amber-800 shadow-sm disabled:opacity-70 transition-colors"
                        >
                            {loading ? 'İşleniyor...' : 'Onayla'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}