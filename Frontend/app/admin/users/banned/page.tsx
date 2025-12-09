'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import StatCard from '@/src/components/ui/Admin/StatCard';
import { fineService } from '@/src/services/fineService';
import { UserFineDto } from '@/src/types/user';

import FineDetailModal from '@/src/components/ui/Admin/Modals/FineDetailModal';
import GenericConfirmModal from '@/src/components/ui/Admin/Modals/GenericConfirmationModal';

function BannedUsersContent() {
    const searchParams = useSearchParams();
    const [fines, setFines] = useState<UserFineDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchEmail, setSearchEmail] = useState("");

    const [selectedFine, setSelectedFine] = useState<UserFineDto | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false);

    const totalDebt = fines.filter(f => f.isActive).reduce((acc, curr) => acc + curr.amount, 0);
    const activeFinesCount = fines.filter(f => f.isActive).length;

    const performSearch = async (email: string) => {
        if (!email.trim()) return;

        setLoading(true);
        try {
            const data = await fineService.getUserFinesByEmail(email);
            if (data.length === 0) toast("Kayıt bulunamadı.", { icon: 'ℹ️' });
            setFines(data);
        } catch (error) {
            toast.error("Cezalar getirilirken hata oluştu.");
            setFines([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchClick = async () => {
        if (!searchEmail.trim()) {
            toast.error("Lütfen bir e-posta adresi giriniz.");
            return;
        }
        await performSearch(searchEmail);
    };

    useEffect(() => {
        const emailFromUrl = searchParams.get('email');
        if (emailFromUrl) {
            setSearchEmail(emailFromUrl);
            performSearch(emailFromUrl);
        }
    }, [searchParams]);

    const handleSearch = async () => {
        if (!searchEmail.trim()) {
            toast.error("Lütfen bir e-posta adresi giriniz.");
            return;
        }
        setLoading(true);
        try {
            const data = await fineService.getUserFinesByEmail(searchEmail);
            if (data.length === 0) toast("Kayıt bulunamadı.", { icon: 'ℹ️' });
            setFines(data);
        } catch (error) {
            toast.error("Cezalar getirilirken hata oluştu.");
            setFines([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const openDetailModal = (fine: UserFineDto) => {
        setSelectedFine(fine);
        setIsDetailOpen(true);
    };

    const openRevokeModal = (fine: UserFineDto) => {
        setSelectedFine(fine);
        setIsRevokeConfirmOpen(true);
    };

    const handleConfirmRevoke = async () => {
        if (!selectedFine) return;

        try {
            await fineService.revokeFineById(selectedFine.fineId);
            toast.success("Ceza kaldırıldı/iptal edildi.");

            setFines(prev => prev.map(f =>
                f.fineId === selectedFine.fineId ? { ...f, isActive: false, status: 'Cancelled' } : f
            ));

        } catch (error) {
            toast.error("İşlem başarısız.");
            throw error;
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="sm:col-span-2 md:col-span-4 mb-2">
                    <h1 className="text-xl md:text-2xl font-bold text-stone-800 font-serif">Ceza Sorgulama</h1>
                    <p className="text-stone-500 text-sm">Kullanıcı bazlı ceza ve borç takibi.</p>
                </div>
                <StatCard title="Toplam Kayıt" value={fines.length} icon="📋" trend={fines.length > 0 ? "Sonuçlar" : "-"} />
                <StatCard title="Aktif Cezalar" value={activeFinesCount} icon="🚫" trendDirection={activeFinesCount > 0 ? "down" : "up"} />
                <StatCard title="Toplam Borç" value={`${totalDebt} TL`} icon="💰" trend="Tahsil Edilecek" />
            </div>

            <div className="bg-white p-4 md:p-5 rounded-lg border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="relative flex-1 w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Kullanıcı E-posta Adresi Giriniz..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-500 text-stone-800"
                    />
                </div>
                <button
                    onClick={handleSearchClick}
                    disabled={loading}
                    className="bg-stone-800 hover:bg-stone-900 text-stone-100 px-8 py-3 rounded text-sm font-bold shadow-sm disabled:opacity-70 transition-colors w-full sm:w-auto"
                >
                    {loading ? '...' : 'Sorgula'}
                </button>
            </div>

            {fines.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-4 bg-stone-50 border-b border-stone-200">
                        <h3 className="font-bold text-stone-700 text-sm md:text-base break-all">
                            Sonuçlar: <span className="text-amber-700">{searchEmail}</span>
                        </h3>
                    </div>

                    <table className="hidden md:table w-full text-sm text-left">
                        <thead className="bg-stone-100 text-stone-500 uppercase text-xs border-b border-stone-200">
                        <tr>
                            <th className="px-6 py-3">Ceza Nedeni</th>
                            <th className="px-6 py-3">Tarih</th>
                            <th className="px-6 py-3 text-center">Tutar</th>
                            <th className="px-6 py-3 text-center">Durum</th>
                            <th className="px-6 py-3 text-right">İşlemler</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                        {fines.map((fine) => (
                            <tr key={fine.fineId} className={`transition-colors ${fine.isActive ? 'hover:bg-red-50/30' : 'hover:bg-stone-50'}`}>
                                <td className="px-6 py-4">
                                    {fine.loanDetails ? (
                                        <div>
                                            <div className="font-bold text-stone-800 text-sm flex items-center gap-2">
                                                📚 {fine.loanDetails.bookTitle}
                                            </div>
                                            <div className="text-xs text-stone-500 mt-1">Gecikme Cezası</div>
                                        </div>
                                    ) : (
                                        <div className="text-stone-700">{fine.fineType}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-stone-600">{formatDate(fine.issuedDate)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-mono font-bold text-stone-800 text-lg">
                                        {fine.amount > 0 ? `${fine.amount} ₺` : '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {fine.isActive ? (
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold border border-red-200 inline-flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200">
                                            Pasif
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openDetailModal(fine)} className="text-amber-700 hover:text-amber-900 font-medium text-xs bg-amber-50 px-3 py-1.5 rounded border border-amber-200 transition-colors">
                                            Detay
                                        </button>
                                        {fine.isActive && (
                                            <button onClick={() => openRevokeModal(fine)} className="text-stone-500 hover:text-red-600 font-medium text-xs bg-white border border-stone-300 hover:border-red-300 px-3 py-1.5 rounded transition-colors">
                                                Kaldır
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="md:hidden divide-y divide-stone-100">
                        {fines.map((fine) => (
                            <div key={fine.fineId} className={`p-4 ${fine.isActive ? 'bg-red-50/10' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        {fine.loanDetails ? (
                                            <div className="font-bold text-stone-800 text-sm mb-1">
                                                📚 {fine.loanDetails.bookTitle}
                                            </div>
                                        ) : (
                                            <div className="font-bold text-stone-800 text-sm mb-1">{fine.fineType}</div>
                                        )}
                                        <div className="text-xs text-stone-500">{formatDate(fine.issuedDate)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-stone-800 text-lg mb-1">
                                            {fine.amount > 0 ? `${fine.amount} ₺` : '-'}
                                        </div>
                                        {fine.isActive ? (
                                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200 inline-block">
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200 inline-block">
                                                Pasif
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-stone-100 border-dashed">
                                    <button
                                        onClick={() => openDetailModal(fine)}
                                        className="text-amber-700 font-medium text-xs border border-amber-200 px-3 py-1.5 rounded bg-amber-50"
                                    >
                                        Detay
                                    </button>
                                    {fine.isActive && (
                                        <button
                                            onClick={() => openRevokeModal(fine)}
                                            className="text-stone-600 hover:text-red-600 font-medium text-xs border border-stone-300 px-3 py-1.5 rounded bg-white"
                                        >
                                            Kaldır
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <FineDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                fine={selectedFine}
            />

            <GenericConfirmModal
                isOpen={isRevokeConfirmOpen}
                onClose={() => setIsRevokeConfirmOpen(false)}
                onConfirm={handleConfirmRevoke}
                title="Cezayı Kaldır"
                message={
                    <span>
                        Bu cezayı (ID: <strong>{selectedFine?.fineId}</strong>) kaldırmak istediğinize emin misiniz?
                        <br/><span className="text-xs text-stone-500">Bu işlem geri alınamaz ve borç/yasak silinir.</span>
                    </span>
                }
                confirmText="Evet, Kaldır"
                isDanger={true}
            />
        </div>
    );
}

export default function BannedUsersPage() {
    return (
        <Suspense fallback={
            <div className="w-full h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div>
                <span className="ml-3 text-stone-600 font-medium">Veriler Yükleniyor...</span>
            </div>
        }>
            <BannedUsersContent />
        </Suspense>
    );
}