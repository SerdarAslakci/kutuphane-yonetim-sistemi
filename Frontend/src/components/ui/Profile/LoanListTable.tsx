'use client';
import React from 'react';
import { LoanDto } from '@/src/types/loan';

interface Props {
    loans: LoanDto[];
    loading: boolean;
    isHistory: boolean;
}

export default function LoanListTable({ loans, loading, isHistory }: Props) {

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return <div className="p-12 text-center text-stone-500 animate-pulse">Veriler yükleniyor...</div>;
    }

    if (loans.length === 0) {
        return <div className="p-12 text-center text-stone-400 italic bg-stone-50 rounded-lg">Kayıt bulunamadı.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-stone-500 uppercase text-xs border-b border-stone-200">
                <tr>
                    <th className="px-6 py-3">Kitap Bilgisi</th>
                    <th className="px-6 py-3">Konum</th>
                    <th className="px-6 py-3">Tarihler</th>
                    <th className="px-6 py-3 text-center">Durum</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                {loans.map((loan) => {
                    // Gecikme Hesaplama (Sadece Aktifler için)
                    const now = new Date();
                    const expected = new Date(loan.expectedReturnDate);
                    const isOverdue = !isHistory && now > expected;
                    const diffTime = Math.abs(expected.getTime() - now.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    return (
                        <tr key={loan.loanId} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-stone-800">{loan.bookTitle}</div>
                                <div className="text-xs text-stone-500">{loan.authorName}</div>
                                <div className="text-[10px] text-stone-400 font-mono mt-1">ISBN: {loan.isbn}</div>
                            </td>

                            <td className="px-6 py-4">
                                    <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs border border-stone-200">
                                        {loan.room} / {loan.shelf}
                                    </span>
                            </td>

                            <td className="px-6 py-4 space-y-1">
                                <div className="text-xs text-stone-500">
                                    <span className="font-semibold">Veriliş:</span> {formatDate(loan.loanDate)}
                                </div>
                                <div className="text-xs text-stone-800">
                                    {isHistory ? (
                                        <>
                                            <span className="font-semibold text-green-700">İade:</span> {formatDate(loan.actualReturnDate)}
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-semibold text-amber-700">Son Teslim:</span> {formatDate(loan.expectedReturnDate)}
                                        </>
                                    )}
                                </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                                {isHistory ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                            ✅ İade Edildi
                                        </span>
                                ) : (
                                    isOverdue ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                                ⚠️ {diffDays} Gün Gecikti
                                            </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                                ⏳ {diffDays} Gün Kaldı
                                            </span>
                                    )
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}