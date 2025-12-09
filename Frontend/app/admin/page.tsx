'use client';

import React, { useEffect, useState } from 'react';
import { dashboardService } from '@/src/services/dashboardService';
import { DashboardStatus } from '@/src/types/dashboard';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: string;
    isDanger?: boolean;
}

const StatCard = ({ title, value, icon, trend, isDanger }: StatCardProps) => (
    <div className={`bg-white p-6 rounded-lg border shadow-sm flex items-start justify-between transition-all hover:shadow-md ${isDanger ? 'border-red-200 bg-red-50/30' : 'border-amber-200/60'}`}>
        <div>
            <p className={`text-sm font-medium mb-1 ${isDanger ? 'text-red-700' : 'text-stone-500'}`}>{title}</p>
            <h3 className={`text-3xl font-bold font-serif ${isDanger ? 'text-red-800' : 'text-amber-950'}`}>{value}</h3>

            {trend && (
                <span className={`text-xs font-bold mt-2 inline-block px-2 py-0.5 rounded ${isDanger ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-600'}`}>
                    {trend}
                </span>
            )}
        </div>
        <div className={`p-3 rounded-lg text-2xl border ${isDanger ? 'bg-red-100 border-red-200 text-red-600' : 'bg-stone-100 border-stone-200'}`}>
            {icon}
        </div>
    </div>
);

const StatCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm animate-pulse">
        <div className="flex justify-between items-start">
            <div className="space-y-3 w-1/2">
                <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                <div className="h-8 bg-stone-200 rounded w-full"></div>
                <div className="h-3 bg-stone-200 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-12 bg-stone-200 rounded-lg"></div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (error) {
                console.error("İstatistikler alınamadı", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-stone-800 font-serif">Genel Bakış</h1>
                <p className="text-stone-500 text-sm">Kütüphane durumunun anlık özeti.</p>
            </div>

            {/* İstatistikler Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    // 4 tane Skeleton göster
                    [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
                ) : stats ? (
                    <>
                        <StatCard
                            title="Toplam Kitap"
                            value={stats.totalBookCount}
                            icon="📚"
                            trend="Envanter"
                        />
                        <StatCard
                            title="Kayıtlı Üyeler"
                            value={stats.userCount}
                            icon="👥"
                            trend="Aktif Kullanıcı"
                        />
                        <StatCard
                            title="Ödünçteki Kitaplar"
                            value={stats.loanedBookCount}
                            icon="⏳"
                            trend="% Doluluk"
                        />
                        <StatCard
                            title="Geciken İadeler"
                            value={stats.overdueBookCount}
                            icon="⚠️"
                            trend={stats.overdueBookCount > 0 ? "İşlem Gerekiyor" : "Sorun Yok"}
                            isDanger={stats.overdueBookCount > 0}
                        />
                    </>
                ) : (
                    <p className="text-red-500 col-span-4">Veri yüklenemedi.</p>
                )}
            </div>

            {/* Son Hareketler Tablosu (Statik kalabilir veya LoanService bağlanabilir)
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-5 border-b border-stone-100 flex justify-between items-center">
                    <h3 className="font-bold text-stone-800">Son İşlemler</h3>
                    <button className="text-xs text-amber-700 font-bold hover:underline">Tümünü Gör</button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3">Üye</th>
                        <th className="px-6 py-3">İşlem</th>
                        <th className="px-6 py-3">Tarih</th>
                        <th className="px-6 py-3">Durum</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                    <tr className="hover:bg-stone-50">
                        <td className="px-6 py-4 font-medium text-stone-800">Ahmet Yılmaz</td>
                        <td className="px-6 py-4">Suç ve Ceza (Ödünç Alma)</td>
                        <td className="px-6 py-4 text-stone-500">10 Dk önce</td>
                        <td className="px-6 py-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">Başarılı</span></td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                        <td className="px-6 py-4 font-medium text-stone-800">Mehmet Demir</td>
                        <td className="px-6 py-4">Nutuk (İade)</td>
                        <td className="px-6 py-4 text-stone-500">1 Saat önce</td>
                        <td className="px-6 py-4"><span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold">İnceleniyor</span></td>
                    </tr>
                    </tbody>
                </table>
            </div>*/}
        </div>
    );
}