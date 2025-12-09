'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Header from "@/src/components/ui/Header";
import { useAuth } from "@/src/hooks/useAuth";
import { userService } from '@/src/services/userService';
import { UserStats, UserFineDto } from '@/src/types/user';
import toast from 'react-hot-toast';

import ProfileSidebar from '@/src/components/ui/Profile/ProfileSidebar';
import ActiveLoans from '@/src/components/ui/Profile/ActiveLoans';
import PastLoans from '@/src/components/ui/Profile/PastLoans';
import PaginationControls from '@/src/components/ui/Admin/Common/PaginationControls';
import FineListTable from '@/src/components/ui/Profile/FineListTable';
import PaymentModal from '@/src/components/ui/Profile/PaymentModal';
import { fineService } from "@/src/services/fineService";

const TABS = {
    ACTIVE_LOANS: 'active_loans',
    PAST_LOANS: 'past_loans',
    ACTIVE_FINES: 'active_fines',
    PAST_FINES: 'past_fines'
};

function ProfileContent() {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState(TABS.ACTIVE_LOANS);
    const [stats, setStats] = useState<UserStats>({ activeLoanCount: 0, totalReadCount: 0, totalFineDebt: 0 });

    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 5;

    const [fines, setFines] = useState<UserFineDto[]>([]);
    const [finesLoading, setFinesLoading] = useState(false);

    const [selectedFine, setSelectedFine] = useState<UserFineDto | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    useEffect(() => {
        setPage(1);
        setTotalCount(0);
        setFines([]);
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === TABS.ACTIVE_FINES || activeTab === TABS.PAST_FINES) {
            fetchFinesData();
        }
    }, [activeTab, page]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await userService.getStats();
            setStats(data);
        } catch (error) { console.error("Stats error", error); }
    };

    const fetchFinesData = async () => {
        setFinesLoading(true);
        try {
            if (activeTab === TABS.ACTIVE_FINES) {
                const result = await fineService.getMyActiveFines(page, pageSize);
                if (result && result.items) {
                    setFines(result.items);
                    setTotalCount(result.totalCount || 0);
                } else {
                    setFines([]);
                    setTotalCount(0);
                }
            }
            else if (activeTab === TABS.PAST_FINES) {
                const result = await fineService.getMyHistoryFines(page, pageSize);

                if (result && result.items) {
                    setFines(result.items);
                    setTotalCount(result.totalCount || 0);
                } else {
                    setFines([]);
                    setTotalCount(0);
                }
            }

        } catch (error) {
            console.error("Cezalar yüklenemedi", error);
            toast.error("Cezalar yüklenemedi.");
        } finally {
            setFinesLoading(false);
        }
    };

    const handlePayClick = (fine: UserFineDto) => {
        setSelectedFine(fine);
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async () => {
        if (!selectedFine) return;

        setPaymentLoading(true);
        const toastId = toast.loading("Ödeme işlemi yapılıyor...");
        try {
            await fineService.payFine(selectedFine.fineId.toString());
            toast.success("Ödeme başarıyla alındı.", { id: toastId });

            fetchFinesData();
            fetchStats();
        } catch (error: any) {
            console.error("Ödeme işlemi başarısız.");
            const errorMessage = error.response?.data?.message || "İşlem başarısız.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsPaymentModalOpen(false);
        setTimeout(() => setSelectedFine(null), 300);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F4] flex flex-col font-sans">
            <Header />

            <main className="container mx-auto px-4 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

                    <div className="lg:col-span-1">
                        <ProfileSidebar user={user} stats={stats} />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white border border-stone-200 rounded-xl shadow-sm min-h-[400px] md:min-h-[600px] flex flex-col">

                            <div className="flex border-b border-stone-200 overflow-x-auto shrink-0 scrollbar-hide">
                                <button
                                    onClick={() => setActiveTab(TABS.ACTIVE_LOANS)}
                                    className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === TABS.ACTIVE_LOANS ? 'border-amber-600 text-amber-800 bg-amber-50/50' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
                                >
                                    📖 Aktif Ödünçler
                                </button>
                                <button
                                    onClick={() => setActiveTab(TABS.PAST_LOANS)}
                                    className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === TABS.PAST_LOANS ? 'border-amber-600 text-amber-800 bg-amber-50/50' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
                                >
                                    ✅ Geçmiş
                                </button>
                                <button
                                    onClick={() => setActiveTab(TABS.ACTIVE_FINES)}
                                    className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === TABS.ACTIVE_FINES ? 'border-red-500 text-red-700 bg-red-50/50' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
                                >
                                    ⚠️ Cezalar
                                </button>
                                <button
                                    onClick={() => setActiveTab(TABS.PAST_FINES)}
                                    className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === TABS.PAST_FINES ? 'border-amber-600 text-amber-800 bg-amber-50/50' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
                                >
                                    📜 Geçmiş Cezalar
                                </button>
                            </div>

                            <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
                                {activeTab === TABS.ACTIVE_LOANS && (
                                    <ActiveLoans page={page} pageSize={pageSize} onDataLoaded={setTotalCount} />
                                )}
                                {activeTab === TABS.PAST_LOANS && (
                                    <PastLoans page={page} pageSize={pageSize} onDataLoaded={setTotalCount} />
                                )}

                                {(activeTab === TABS.ACTIVE_FINES || activeTab === TABS.PAST_FINES) && (
                                    <FineListTable
                                        fines={fines}
                                        loading={finesLoading}
                                        isHistory={activeTab === TABS.PAST_FINES}
                                        onPayClick={activeTab === TABS.ACTIVE_FINES ? handlePayClick : undefined}
                                    />
                                )}
                            </div>

                            {totalCount > 0 && (
                                <div className="p-4 border-t border-stone-100 bg-stone-50 rounded-b-xl mt-auto shrink-0 overflow-x-auto">
                                    <PaginationControls
                                        currentPage={page}
                                        totalCount={totalCount}
                                        pageSize={pageSize}
                                        onPageChange={setPage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmPayment}
                fine={selectedFine}
                loading={paymentLoading}
            />
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
                    <span className="text-amber-900 font-serif font-medium animate-pulse">Profil Yükleniyor...</span>
                </div>
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}