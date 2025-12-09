'use client';

import React, { useEffect, useState } from 'react';
import { loanService } from '@/src/services/loanService';
import { LoanWithUserDetailsDto } from '@/src/types/loan';
import {PaginatedResult} from "@/src/types/book";
import LoanTable from '@/src/components/ui/Admin/LoanTable';
import Pagination from '@/src/components/ui/Admin/Common/PaginationControls';
import StatCard from '@/src/components/ui/Admin/StatCard';
import toast from 'react-hot-toast';

export default function ActiveLoansPage() {
    const [data, setData] = useState<PaginatedResult<LoanWithUserDetailsDto> | null>(null);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchLoans(currentPage);
    }, [currentPage]);

    const fetchLoans = async (page: number) => {
        setLoading(true);
        try {
            const result = await loanService.getAllActiveLoans(page, pageSize);
            setData(result);
        } catch (error) {
            toast.error("Veriler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-stone-800 font-serif">Aktif Ödünçler</h1>
                    <p className="text-stone-500 text-sm">Okunmakta olan kitaplar listesi.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <StatCard
                    title="Toplam Aktif"
                    value={data?.totalCount || 0}
                    icon="📚"
                    trend="Okunuyor"
                />
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg border border-stone-200 shadow-sm">
                <LoanTable
                    loans={data?.items || []}
                    loading={loading}
                    emptyMessage="Aktif ödünç kaydı bulunamadı."
                />

                {data && (
                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            pageSize={pageSize}
                            totalCount={data.totalCount}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}