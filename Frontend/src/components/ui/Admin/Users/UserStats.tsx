import React from 'react';
import StatCard from '@/src/components/ui/Admin/StatCard';

interface Props {
    totalCount: number;
    penalizedCount: number;
    activeReaderCount: number;
}

export default function UserStats({ totalCount, penalizedCount, activeReaderCount }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="sm:col-span-2 md:col-span-4 mb-2">
                <h1 className="text-xl md:text-2xl font-bold text-stone-800 font-serif">Üye Yönetimi</h1>
                <p className="text-stone-500 text-sm">Kayıtlı üyeleri görüntüleyin, düzenleyin veya engelleyin.</p>
            </div>

            <StatCard
                title="Toplam Üye"
                value={totalCount}
                icon="👥"
                trendDirection="up"
            />

            <StatCard
                title="Cezalı Üyeler"
                value={penalizedCount}
                icon="🚫"
                trendDirection={penalizedCount > 0 ? "down" : "neutral"}
            />

            <StatCard
                title="Aktif Okuyucular"
                value={activeReaderCount}
                icon="📖"
                trendDirection="up"
            />
        </div>
    );
}