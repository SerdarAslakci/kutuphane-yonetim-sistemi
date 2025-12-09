import React from 'react';
import { UserStats } from '@/src/types/user';

interface Props {
    user: any;
    stats: UserStats;
}

export default function ProfileSidebar({ user, stats }: Props) {
    return (
        <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6 text-center">
                <div className="w-24 h-24 mx-auto bg-amber-900 text-amber-50 rounded-full flex items-center justify-center text-3xl font-serif font-bold mb-4 border-4 border-amber-100">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-stone-800">{user?.firstName} {user?.lastName}</h2>
                <p className="text-stone-500 text-sm mb-4">{user?.email}</p>

                <div className="border-t border-stone-100 pt-4 flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-500">Üyelik No:</span>
                        <span className="font-mono font-medium text-stone-800">#{user?.id?.substring(0, 6)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-500">Telefon:</span>
                        <span className="text-stone-800">{user?.phoneNumber || "-"}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-4">
                <h3 className="font-bold text-stone-800 mb-3 text-sm uppercase tracking-wide">Özet</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-800 text-sm font-medium">Aktif Kitaplar</span>
                        <span className="text-2xl font-bold text-blue-900">{stats.activeLoanCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-green-800 text-sm font-medium">Okunan Toplam</span>
                        <span className="text-2xl font-bold text-green-900">{stats.totalReadCount}</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${stats.totalFineDebt > 0 ? 'bg-red-50' : 'bg-stone-50'}`}>
                        <span className={`${stats.totalFineDebt > 0 ? 'text-red-800' : 'text-stone-600'} text-sm font-medium`}>Ceza Borcu</span>
                        <span className={`text-2xl font-bold ${stats.totalFineDebt > 0 ? 'text-red-900' : 'text-stone-800'}`}>{stats.totalFineDebt} ₺</span>
                    </div>
                </div>
            </div>
        </div>
    );
}