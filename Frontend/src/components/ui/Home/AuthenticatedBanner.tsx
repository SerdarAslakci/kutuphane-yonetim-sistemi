import React from 'react';

interface Props {
    user: any;
    totalBookCount: number;
    onProfileClick: () => void;
}

export default function AuthenticatedBanner({ user, totalBookCount, onProfileClick }: Props) {
    return (
        <div className="bg-gradient-to-r from-amber-50 to-white border border-amber-100 rounded-xl shadow-sm p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-100 rounded-full opacity-50 blur-xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
                        Tekrar hoş geldin, <span className="text-amber-700">{user?.firstName}</span>! 👋
                    </h2>
                    <p className="text-stone-600 mt-2 text-sm md:text-base max-w-xl">
                        Kütüphanemizde şu an keşfedilmeyi bekleyen <span className="font-bold text-stone-900">{totalBookCount}</span> kitap bulunuyor.
                        Bugün ne okumak istersin?
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={onProfileClick}
                        className="flex-1 md:flex-none text-center px-5 py-2.5 bg-white border border-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 hover:border-amber-300 transition-all shadow-sm text-sm"
                    >
                        👤 Profilim
                    </button>
                </div>
            </div>
        </div>
    );
}