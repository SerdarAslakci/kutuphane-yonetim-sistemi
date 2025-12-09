'use client';
import React from 'react';
import { UserFineDto } from '@/src/types/user';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PaymentReceiptPdf } from '@/src/components/ui/Pdf/PaymentReceipt';

interface Props {
    fines: UserFineDto[];
    loading: boolean;
    isHistory: boolean;
    onPayClick?: (fine: UserFineDto) => void;
}

export default function FineListTable({ fines, loading, isHistory, onPayClick }: Props) {

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-10 h-10 border-4 border-stone-200 border-t-amber-700 rounded-full animate-spin"></div>
                <span className="text-stone-500 text-sm font-medium animate-pulse">Veriler yükleniyor...</span>
            </div>
        );
    }

    if (fines.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-stone-50/50 rounded-lg border border-dashed border-stone-200">
                <span className="text-4xl mb-2">📭</span>
                <span className="text-stone-500 font-medium">Kayıt bulunamadı.</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-stone-200 shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-stone-500 uppercase text-xs border-b border-stone-200 font-bold tracking-wider">
                <tr>
                    <th className="px-6 py-4 w-1/5">Ceza Tipi</th>
                    <th className="px-6 py-4 w-2/5">Açıklama / Kitap</th>
                    <th className="px-6 py-4 w-1/5">Tarih</th>
                    <th className="px-6 py-4 text-right w-1/5">Tutar</th>
                    <th className="px-6 py-4 text-center w-1/5">Durum</th>
                    <th className="px-6 py-4 text-right w-1/6">İşlem</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                {fines.map((fine) => {
                    const isBan = fine.fineType.toLowerCase().includes('yasak') || fine.fineType.toLowerCase().includes('ban');

                    const paymentId = `TR-${fine.fineId}-${new Date().getFullYear()}`;
                    return (
                        <tr key={fine.fineId} className={`group transition-all hover:bg-amber-50/40 ${isBan ? 'bg-red-50/10' : ''}`}>

                            <td className="px-6 py-4 align-top">
                                <span className={`font-bold block mb-1 ${isBan ? 'text-red-700' : 'text-stone-700'}`}>
                                    {fine.fineType}
                                </span>
                                {isBan && <span className="text-[10px] text-red-500 uppercase font-bold border border-red-200 px-1.5 py-0.5 rounded bg-white">Kritik</span>}
                            </td>

                            <td className="px-6 py-4 align-top">
                                {fine.loanDetails ? (
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-stone-800 flex items-center gap-2">
                                            <span className="text-amber-700">📖</span> {fine.loanDetails.bookTitle}
                                        </span>
                                        <span className="text-xs text-stone-500 font-mono bg-stone-100 px-2 py-0.5 rounded w-fit border border-stone-200">
                                            {fine.loanDetails.barcodeNumber}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-stone-600 italic text-sm leading-relaxed block max-w-xs">
                                        "{fine.description || "Açıklama yok"}"
                                    </span>
                                )}
                            </td>

                            <td className="px-6 py-4 align-top text-stone-500 font-medium">
                                {formatDate(fine.issuedDate)}
                            </td>

                            <td className="px-6 py-4 align-top text-right">
                                <span className={`font-mono font-bold text-lg ${fine.amount > 0 ? 'text-stone-800' : 'text-stone-400'}`}>
                                    {fine.amount > 0 ? `${fine.amount} ₺` : '-'}
                                </span>
                            </td>

                            <td className="px-6 py-4 align-top text-center">
                                {isHistory ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                        Ödendi
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
                                        Ödenmedi
                                    </span>
                                )}
                            </td>

                            <td className="px-6 py-4 align-top text-right">
                                {isHistory ? (
                                    <PDFDownloadLink
                                        document={<PaymentReceiptPdf fine={fine} userName="Sayın Üye" paymentId={paymentId} />}
                                        fileName={`Dekont-${fine.fineId}.pdf`}
                                        className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm"
                                    >
                                        {({ loading }) => (
                                            loading ? 'Hazırlanıyor...' : (
                                                <>
                                                    <span>📄</span> Dekont
                                                </>
                                            )
                                        )}
                                    </PDFDownloadLink>
                                ) : (
                                    isBan ? (
                                        <span className="text-[10px] text-stone-400 italic block mt-2 select-none">
                                            Yetkili İşlemi
                                        </span>
                                    ) : (
                                        onPayClick && (
                                            <button
                                                onClick={() => onPayClick(fine)}
                                                className="bg-stone-800 hover:bg-green-700 text-white px-4 py-2 rounded-md text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1 ml-auto group-hover:shadow-md"
                                            >
                                                <span>💸</span> Öde
                                            </button>
                                        )
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