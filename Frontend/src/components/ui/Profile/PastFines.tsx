'use client';
import React, { useState, useEffect } from 'react';
import { UserFineDto } from '@/src/types/user';
import FineListTable from './FineListTable';
import {fineService} from "@/src/services/fineService";
import {PaginatedResult} from "@/src/types/book";

interface Props {
    page: number;
    pageSize: number;
    onDataLoaded: (total: number) => void;
}

export default function PastFines({ page, pageSize, onDataLoaded }: Props) {
    const [fines, setFines] = useState<UserFineDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFines = async () => {
            setLoading(true);
            try {
                const result: PaginatedResult<UserFineDto> = await fineService.getMyHistoryFines(page, pageSize);

                if (Array.isArray(result)) {
                    setFines(result);
                    onDataLoaded(result.length);
                } else if (result.items) {
                    setFines(result.items);
                    onDataLoaded(result.totalCount);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFines();
    }, [page, pageSize]);

    return (
        <FineListTable
            fines={fines}
            loading={loading}
            isHistory={true}
        />
    );
}