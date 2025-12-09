'use client';

import React, { useState } from 'react';
import { BookDetail } from '@/src/types/bookDetail';

interface Props {
    book: BookDetail;
}

const CopyStatusList = ({ book }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const totalCopies = book.bookCopies.length;
    const availableCopies = book.bookCopies.filter(c => c.isAvailable).length;

    const totalPages = Math.ceil(totalCopies / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentCopies = book.bookCopies.slice(startIndex, startIndex + pageSize);

    const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    return (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-amber-950">
                    Konum ve Durum Bilgisi
                </h3>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-stone-50 border-stone-200 text-stone-600">
                        Toplam: {totalCopies}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${availableCopies > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {availableCopies > 0 ? `${availableCopies} Adet Mevcut` : 'Tükendi'}
                    </span>
                </div>
            </div>

            {totalCopies === 0 ? (
                <p className="text-stone-500 italic text-sm">Bu kitaba ait kopya kaydı bulunamadı.</p>
            ) : (
                <div className="flex flex-col min-h-[300px]">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-4 py-3">Oda / Salon</th>
                                <th className="px-4 py-3">Raf Kodu</th>
                                <th className="px-4 py-3 text-right">Durum</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                            {currentCopies.map((copy) => (
                                <tr key={copy.id} className="hover:bg-amber-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-amber-900">
                                        {copy.shelf?.room?.roomCode}
                                        <span className="text-stone-400 font-normal ml-1 hidden sm:inline">
                                            ({copy.shelf?.room?.description})
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 font-bold text-stone-800">
                                        {copy.shelf?.shelfCode}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        {copy.isAvailable ? (
                                            <span className="inline-flex items-center gap-1 text-green-700 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Rafta
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Ödünçte
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {totalCopies > pageSize && (
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-100">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-xs font-medium text-stone-600 bg-white border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Önceki
                            </button>

                            <span className="text-xs text-stone-500 font-medium">
                                Sayfa {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-xs font-medium text-stone-600 bg-white border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sonraki →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CopyStatusList;