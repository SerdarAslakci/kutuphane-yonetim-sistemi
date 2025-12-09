'use client';
import React, { useState, useEffect } from 'react';
import { loanService } from '@/src/services/loanService';
import { LoanDto } from '@/src/types/loan';
import LoanListTable from './LoanListTable';

interface Props {
    page: number;
    pageSize: number;
    onDataLoaded: (total: number) => void;
}

export default function ActiveLoans({ page, pageSize, onDataLoaded }: Props) {
    const [loans, setLoans] = useState<LoanDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await loanService.getMyActiveLoans(page, pageSize);
                if (isMounted) {
                    setLoans(result.items || []);
                    onDataLoaded(result.totalCount || 0);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();

        return () => { isMounted = false; };
    }, [page, pageSize]);

    return (
        <LoanListTable loans={loans} loading={loading} isHistory={false} />
    );
}