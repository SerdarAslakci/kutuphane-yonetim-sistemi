'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { loanService } from '@/src/services/loanService';
import { ReturnLoanResponseDto } from '@/src/types/loan';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReturnBookModal({ isOpen, onClose }: Props) {
    const [barcode, setBarcode] = useState('');
    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState<ReturnLoanResponseDto | null>(null);

    useEffect(() => {
        if (isOpen) {
            setBarcode('');
            setResult(null);
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcode.trim()) return toast.error("Barkod giriniz.");

        setLoading(true);
        const toastId = toast.loading("İade işlemi yapılıyor...");

        try {
            const data = await loanService.returnBook(barcode);

            setResult(data);
            toast.success(data.message || "İade başarılı", { id: toastId });

        } catch (error: any) {
            console.error("Kitap iade edilemedi", error.response.data);
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

    const handleReset = () => {
        setResult(null);
        setBarcode('');
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-stone-200 overflow-hidden" onClick={e => e.stopPropagation()}>

                <div className={`p-4 border-b flex justify-between items-center ${result ? 'bg-green-50 border-green-100' : 'bg-stone-50 border-stone-100'}`}>
                    <h3 className={`font-serif font-bold text-xl flex items-center gap-2 ${result ? 'text-green-900' : 'text-stone-800'}`}>
                        {result ? <span>✅ İşlem Başarılı</span> : <span>↩️ İade Al</span>}
                    </h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">✕</button>
                </div>

                <div className="p-6">

                    {result ? (
                        <div className="space-y-5 animate-in zoom-in duration-300">

                            <div className="text-center">
                                <p className="text-green-700 font-medium text-lg">{result.message}</p>
                                <p className="text-xs text-stone-400 mt-1">{formatDate(result.returnedDate)}</p>
                            </div>

                            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-3 text-sm">
                                <div className="flex justify-between border-b border-stone-200 pb-2">
                                    <span className="text-stone-500">Kitap Adı:</span>
                                    <span className="font-bold text-stone-800 text-right">{result.bookTitle}</span>
                                </div>
                                <div className="flex justify-between border-b border-stone-200 pb-2">
                                    <span className="text-stone-500">Barkod:</span>
                                    <span className="font-mono text-stone-700">{result.barcode}</span>
                                </div>
                                <div className="flex justify-between border-b border-stone-200 pb-2">
                                    <span className="text-stone-500">Üye:</span>
                                    <span className="font-medium text-stone-800">{result.memberFullName}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-stone-500">Durum:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        result.returnStatus.includes("Gecik")
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                    }`}>
                                        {result.returnStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2.5 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded font-medium transition-colors"
                                >
                                    Kapat
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-2.5 bg-green-700 text-white hover:bg-green-800 rounded font-bold transition-colors shadow-sm"
                                >
                                    Yeni İade Al
                                </button>
                            </div>
                        </div>
                    ) : (

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">Barkod Numarası</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={barcode}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) setBarcode(e.target.value);
                                    }}
                                    placeholder="Kitap barkodunu giriniz..."
                                    className="w-full border border-stone-300 text-stone-800 rounded p-3 text-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all font-mono text-center tracking-widest"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded font-medium transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 text-sm bg-green-700 text-white rounded font-bold hover:bg-green-800 shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                                >
                                    {loading ? 'İşleniyor...' : 'İadeyi Onayla'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}