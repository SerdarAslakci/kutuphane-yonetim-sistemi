'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const MENU_ITEMS = [
    { title: 'Genel Bakış', path: '/admin', icon: '📊' },
    { title: 'Kitap Listesi', path: '/admin/books', icon: '📚' },
    { title: 'Yeni Kitap Ekle', path: '/admin/books/add', icon: '➕' },
    { title: 'Üye Listesi', path: '/admin/users', icon: '👥' },
    { title: 'Cezalı Üyeler', path: '/admin/users/banned', icon: '🚫' },
    { title: 'Aktif Ödünçler', path: '/admin/loans/active', icon: '⏳' },
    { title: 'Geçmiş İşlemler', path: '/admin/loans/history', icon: '📜' },
    { title: 'Gecikmiş İadeler', path: '/admin/loans/overdue', icon: '⚠️' },
    { title: 'Odalar ve Raflar', path: '/admin/shelves', icon: '🗄️' },
    { title: 'Kategori Listesi', path: '/admin/categories', icon: '🏷️' },
    { title: 'Yayıncılar', path: '/admin/publishers', icon: '🏢' },
    { title: 'Yazarlar', path: '/admin/authors', icon: '✍️' }
];

interface AdminHeaderProps {
    onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState(MENU_ITEMS);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setQuery(text);
        if (text.length > 0) {
            setIsOpen(true);
            const filtered = MENU_ITEMS.filter(item =>
                item.title.toLowerCase().includes(text.toLowerCase())
            );
            setResults(filtered);
        } else {
            setIsOpen(false);
        }
    };

    const handleSelect = (path: string) => {
        router.push(path);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 gap-4">

            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-stone-600 hover:bg-stone-100 rounded-md lg:hidden"
                >
                    <span className="text-xl">☰</span>
                </button>

                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-3 group shrink-0"
                    title="Site Ana Sayfasına Dön"
                >
                    <div className="w-8 h-8 lg:w-9 lg:h-9 bg-amber-950 text-amber-50 flex items-center justify-center rounded-lg font-serif font-bold text-lg lg:text-xl shadow-sm group-hover:bg-amber-900 transition-all">
                        K
                    </div>
                    <div className="hidden sm:flex flex-col items-start leading-tight">
                        <span className="font-serif font-bold text-stone-800 text-base lg:text-lg tracking-tight group-hover:text-amber-900 transition-colors">
                            Kütüphane
                        </span>
                        <span className="text-[9px] lg:text-[10px] font-bold text-stone-400 uppercase tracking-wider group-hover:text-amber-700 transition-colors flex items-center gap-1">
                            <span>←</span> Siteye Dön
                        </span>
                    </div>
                </button>
            </div>

            <div className="flex-1 max-w-xl relative" ref={wrapperRef}>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        onFocus={() => query.length > 0 && setIsOpen(true)}
                        placeholder="Ara..."
                        className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-stone-400"
                    />
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-stone-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {results.length > 0 ? (
                            <ul className="py-1 max-h-64 overflow-y-auto scrollbar-thin">
                                {results.map((item, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => handleSelect(item.path)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center gap-3 transition-colors group"
                                        >
                                            <span className="text-lg opacity-70 group-hover:opacity-100">{item.icon}</span>
                                            <span className="text-sm font-medium text-stone-700 group-hover:text-amber-900">{item.title}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-stone-500 text-sm">Sonuç yok.</div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 lg:gap-5 shrink-0">
                <div className="hidden lg:block h-8 w-px bg-stone-200"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden xl:block leading-tight">
                        <div className="text-sm font-bold text-stone-800">Admin</div>
                        <div className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full inline-block mt-0.5">Süper Yönetici</div>
                    </div>
                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-amber-800 to-amber-950 text-amber-50 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;