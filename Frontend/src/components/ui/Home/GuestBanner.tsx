import React from 'react';
import Link from 'next/link';

export default function GuestBanner() {
    return (
        <div className="bg-stone-900 rounded-xl shadow-md p-6 mb-6 text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-amber-50">Kütüphaneye Üye Olun</h2>
                    <p className="text-stone-300 mt-2 text-sm md:text-base">
                        Kitap ödünç almak, favorilerinizi kaydetmek ve okuma geçmişinizi takip etmek için giriş yapın.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Link
                        href="/login"
                        className="flex-1 md:flex-none px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors shadow-lg text-sm text-center"
                    >
                        Giriş Yap
                    </Link>
                    <Link
                        href="/register"
                        className="flex-1 md:flex-none px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-lg transition-colors border border-stone-700 text-sm text-center"
                    >
                        Kayıt Ol
                    </Link>
                </div>
            </div>
        </div>
    );
}