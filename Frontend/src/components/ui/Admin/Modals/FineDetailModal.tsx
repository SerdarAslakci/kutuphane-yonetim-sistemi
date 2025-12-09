'use client';

import React from 'react';
import { UserFineDto } from '@/src/types/user'; // DTO yolunu kontrol et

interface Props {
    isOpen: boolean;
    onClose: () => void;
    fine: UserFineDto | null;
}

export default function FineDetailModal({ isOpen, onClose, fine }: Props) {
    if (!isOpen || !fine) return null;

    const formatDate = (dateStr?: string) => {
        if(!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-stone-200 overflow-hidden" onClick={e => e.stopPropagation()}>

                <div className="flex justify-between items-center p-4 border-b border-stone-100 bg-stone-50">
                    <h3 className="font-serif font-bold text-amber-950 flex items-center gap-2">
                        <span className="text-xl">📋</span> Ceza Detayı #{fine.fineId}
                    </h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">✕</button>
                </div>

                <div className="p-6 space-y-5">

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Ceza Tipi</label>
                            <p className="font-medium text-stone-800 mt-0.5">{fine.fineType}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Veriliş Tarihi</label>
                            <p className="font-medium text-stone-800 mt-0.5">{formatDate(fine.issuedDate)}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Tutar</label>
                            <p className="font-bold text-red-700 text-lg mt-0.5">{fine.amount} ₺</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Durum</label>
                            <p className={`font-bold mt-0.5 inline-flex items-center gap-1 ${fine.isActive ? 'text-red-600' : 'text-green-600'}`}>
                                {fine.isActive ? (
                                    <>🔴 Ödenmedi</>
                                ) : (
                                    <>🟢 Ödendi / Pasif</>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Dinamik Alan: Gecikme Detayı veya Açıklama */}
                    <div className={`p-4 rounded-md border ${fine.loanDetails ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
                        <label className={`text-xs font-bold uppercase block mb-2 ${fine.loanDetails ? 'text-blue-800' : 'text-amber-800'}`}>
                            {fine.loanDetails ? "İade / Gecikme Bilgisi" : "Yönetici Notu"}
                        </label>

                        {fine.loanDetails ? (
                            <div className="text-sm text-stone-700 space-y-2">
                                <div className="font-bold flex items-start gap-2">
                                    <span>📖</span>
                                    <span>{fine.loanDetails.bookTitle}</span>
                                </div>
                                <div className="flex justify-between text-xs border-t border-blue-200/50 pt-2 mt-2">
                                    <span className="text-stone-500">Barkod:</span>
                                    <span className="font-mono font-medium">{fine.loanDetails.barcodeNumber}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-stone-500">Beklenen:</span>
                                    <span className="text-amber-700 font-medium">{formatDate(fine.loanDetails.expectedReturnDate).split(' ')[0]}</span>
                                </div>
                                {fine.loanDetails.actualReturnDate && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-stone-500">Teslim:</span>
                                        <span className="text-green-700 font-medium">{formatDate(fine.loanDetails.actualReturnDate).split(' ')[0]}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-stone-700 italic leading-relaxed">
                                "{fine.description}"
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded text-sm font-medium transition-colors shadow-sm">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}