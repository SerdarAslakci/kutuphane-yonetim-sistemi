"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "@/src/hooks/useAuth";

const Header = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, user, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('title') || '');

    const isAdmin = isAuthenticated && user && (Array.isArray(user.roles) ? user.roles.includes('Admin') : user.roles === 'Admin');

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('title', searchTerm);
        } else {
            params.delete('title');
        }
        router.push(`/?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <header className="bg-amber-950 text-amber-50 shadow-lg py-4 border-b-4 border-amber-900 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="flex items-center justify-between w-full md:w-auto shrink-0">
                    <div
                        className="text-2xl font-serif font-bold tracking-wide cursor-pointer flex items-center gap-2"
                        onClick={() => router.push('/')}
                    >
                        <span className="text-amber-100">Kütüphane</span>
                        <span className="text-amber-500 font-extrabold">App</span>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => router.push('/admin')}
                            className="md:hidden px-3 py-1.5 bg-red-900/90 text-red-50 border border-red-700/50 rounded shadow-sm text-xs font-bold uppercase tracking-wide flex items-center gap-1 active:scale-95 transition-transform"
                        >
                            <span>⚙️</span> Yönetim
                        </button>
                    )}
                </div>
                <div className="flex-1 w-full max-w-2xl flex shadow-inner">
                    <input
                        type="text"
                        placeholder="Eser adı ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-2 bg-amber-50 text-amber-900 placeholder-amber-900/50 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-600 border border-transparent"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-amber-700 text-amber-100 font-serif font-semibold px-6 py-2 rounded-r-md hover:bg-amber-600 transition-colors border-l border-amber-800">
                        Ara
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-4 text-sm font-medium shrink-0">
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-4">

                            {isAdmin && (
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="px-3 py-1.5 bg-red-900/80 hover:bg-red-800 text-red-50 border border-red-700 rounded shadow-sm transition-colors text-xs font-bold uppercase tracking-wide flex items-center gap-1"
                                >
                                    <span>⚙️</span> Yönetim
                                </button>
                            )}

                            <div
                                onClick={() => router.push('/profile')}
                                className="flex flex-col items-end cursor-pointer group"
                            >
                                <span className="text-amber-100 font-serif text-sm group-hover:text-amber-300 transition">
                                    Merhaba, {user.firstName}
                                </span>
                                <span className="text-[10px] text-amber-400 uppercase tracking-wider">
                                    {isAdmin ? 'Yönetici' : 'Üye'}
                                </span>
                            </div>

                            <div className="h-8 w-[1px] bg-amber-800"></div>

                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/login');
                                }}
                                className="text-amber-200/80 hover:text-red-300 transition-colors font-serif text-sm"
                            >
                                Çıkış
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => router.push('/login')}
                                className="text-amber-200 hover:text-amber-50 transition font-serif">
                                Giriş Yap
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="bg-amber-100 text-amber-950 px-5 py-2 rounded shadow-md hover:bg-white transition-colors font-serif font-bold">
                                Kayıt Ol
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;