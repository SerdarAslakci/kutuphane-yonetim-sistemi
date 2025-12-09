import React from 'react';
import { LoanWithUserDetailsDto } from '@/src/types/loan';

interface Props {
    loans: LoanWithUserDetailsDto[];
    loading: boolean;
    emptyMessage: string;
    isOverdueList?: boolean;
}

export default function LoanTable({ loans, loading, emptyMessage, isOverdueList = false }: Props) {

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return <div className="p-8 text-center text-stone-500">Yükleniyor...</div>;
    }

    if (loans.length === 0) {
        return <div className="p-8 text-center text-stone-500 bg-stone-50 rounded border border-stone-200">{emptyMessage}</div>;
    }

    const getStatusBadge = (loan: LoanWithUserDetailsDto) => {
        const isReturned = !!loan.actualReturnDate;
        const now = new Date();
        const expectedDate = new Date(loan.expectedReturnDate);
        const actualDate = loan.actualReturnDate ? new Date(loan.actualReturnDate) : null;
        const returnedLate = isReturned && actualDate && actualDate > expectedDate;
        const isOverdueActive = !isReturned && now > expectedDate;

        if (isReturned) {
            if (returnedLate) return <span className="px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">⚠️ Geç İade</span>;
            return <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200">✅ Tamamlandı</span>;
        } else {
            if (isOverdueActive || isOverdueList) return <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">🚫 Gecikmiş</span>;
            return <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">⏳ Okunuyor</span>;
        }
    };

    return (
        <>
            <div className="hidden md:block overflow-x-auto border border-stone-200 rounded-lg shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-100 text-stone-600 font-bold uppercase text-xs border-b border-stone-200">
                    <tr>
                        <th className="px-6 py-3">Kitap Bilgisi</th>
                        <th className="px-6 py-3">Kullanıcı</th>
                        <th className="px-6 py-3">Konum</th>
                        <th className="px-6 py-3">Tarihler</th>
                        <th className="px-6 py-3 text-center">Durum</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                    {loans.map((loan) => (
                        <tr key={loan.loanId} className="hover:bg-stone-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-stone-800">{loan.bookTitle}</div>
                                <div className="text-xs text-stone-500">{loan.authorName}</div>
                                <div className="text-[10px] text-stone-400 font-mono mt-1">ISBN: {loan.isbn}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-stone-800">{loan.userFullName}</div>
                                <div className="text-xs text-stone-500">{loan.userEmail}</div>
                                <div className="text-xs text-stone-500">{loan.userPhoneNumber}</div>
                            </td>
                            <td className="px-6 py-4">
                                    <span className="inline-block bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded border border-amber-100">
                                        {loan.room} / {loan.shelf}
                                    </span>
                            </td>
                            <td className="px-6 py-4 space-y-1">
                                <div className="text-xs">
                                    <span className="text-stone-400">Veriliş:</span> <span className="text-stone-700">{formatDate(loan.loanDate)}</span>
                                </div>
                                <div className="text-xs">
                                    <span className="text-stone-400">Beklenen:</span>
                                    <span className={`font-bold ml-1 ${new Date() > new Date(loan.expectedReturnDate) && !loan.actualReturnDate ? 'text-red-600' : 'text-stone-700'}`}>
                                            {formatDate(loan.expectedReturnDate)}
                                        </span>
                                </div>
                                {loan.actualReturnDate && (
                                    <div className="text-xs">
                                        <span className="text-stone-400">İade:</span>
                                        <span className="text-green-700 font-medium ml-1">{formatDate(loan.actualReturnDate)}</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {getStatusBadge(loan)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4">
                {loans.map((loan) => (
                    <div key={loan.loanId} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h3 className="font-bold text-stone-800 text-sm">{loan.bookTitle}</h3>
                                <p className="text-xs text-stone-500">{loan.authorName}</p>
                            </div>
                            <div>{getStatusBadge(loan)}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50 p-3 rounded border border-stone-100">
                            <div>
                                <span className="block text-[10px] text-stone-400 uppercase font-bold">Kullanıcı</span>
                                <span className="font-medium">{loan.userFullName}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-stone-400 uppercase font-bold">Konum</span>
                                <span>{loan.room} / {loan.shelf}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-stone-400 uppercase font-bold">Veriliş</span>
                                <span>{formatDate(loan.loanDate)}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-stone-400 uppercase font-bold">Beklenen</span>
                                <span className={new Date() > new Date(loan.expectedReturnDate) && !loan.actualReturnDate ? 'text-red-600 font-bold' : ''}>
                                    {formatDate(loan.expectedReturnDate)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}