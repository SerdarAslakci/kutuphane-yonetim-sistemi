'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

interface MenuItem {
    title: string;
    icon: string;
    path?: string;
    subItems?: { title: string; path: string }[];
}

const menuItems: MenuItem[] = [
    {
        title: 'Genel Bakış',
        icon: '📊',
        path: '/admin'
    },
    {
        title: 'Kitap İşlemleri',
        icon: '📚',
        subItems: [
            {title: 'Kitap Listesi', path: '/admin/books'},
            {title: 'Yeni Kitap Ekle', path: '/admin/books/add'},
        ]
    },
    {
        title: 'Üye Yönetimi',
        icon: '👥',
        subItems: [
            {title: 'Üye Listesi', path: '/admin/users'},
            {title: 'Cezalı Üyeler', path: '/admin/users/banned'},
        ]
    },
    {
        title: 'Ödünç & İade',
        icon: '⏳',
        subItems: [
            {title: 'Aktif Ödünçler', path: '/admin/loans/active'},
            {title: 'Geçmiş İşlemler', path: '/admin/loans/history'},
            {title: 'Gecikmiş İadeler', path: '/admin/loans/overdue'}
        ]
    },
    {
        title: 'Yerleşim',
        icon: '🗄️',
        subItems: [
            {title: 'Odalar ve Raflar', path: '/admin/shelves'},
        ]
    },
    {
        title: 'Kategoriler',
        icon: '🏷️',
        subItems: [
            {title: 'Kategori Listesi', path: '/admin/categories'},
        ]
    },
    {
        title: 'Yayıncı & Yazarlar',
        icon: '✍️',
        subItems: [
            {title: 'Yayıncılar', path: '/admin/publishers'},
            {title: 'Yazarlar', path: '/admin/authors'}
        ]
    }
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const newOpenMenus = {...openMenus};
        menuItems.forEach(item => {
            if (item.subItems) {
                const isChildActive = item.subItems.some(sub => pathname === sub.path);
                if (isChildActive) newOpenMenus[item.title] = true;
            }
        });
        setOpenMenus(newOpenMenus);
        if (window.innerWidth < 1024) onClose();
    }, [pathname]);

    const toggleMenu = (title: string) => {
        setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-screen w-64 bg-stone-900 text-stone-300 flex flex-col 
                border-r border-stone-800 shadow-xl z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static
            `}>
                <div className="p-6 border-b border-stone-800 shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-amber-500">
                            Kütüphane<span className="text-stone-100">Panel</span>
                        </h2>
                        <p className="text-xs text-stone-500 mt-1">Yönetim Sistemi v1.0</p>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-stone-400 hover:text-white">
                        ✕
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const hasSubItems = item.subItems && item.subItems.length > 0;
                        const isOpenMenu = openMenus[item.title];
                        const isDirectActive = !hasSubItems && pathname === item.path;

                        return (
                            <div key={item.title} className="mb-1">
                                <div
                                    onClick={() => hasSubItems ? toggleMenu(item.title) : null}
                                    className={`
                                        flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 cursor-pointer select-none group
                                        ${isDirectActive
                                        ? 'bg-amber-900/40 text-amber-400 border border-amber-800/50'
                                        : 'hover:bg-stone-800 hover:text-stone-100'}
                                    `}
                                >
                                    {hasSubItems ? (
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="text-lg opacity-80 group-hover:opacity-100">{item.icon}</span>
                                            <span className="font-medium text-sm flex-1">{item.title}</span>
                                            <span className={`text-[10px] transition-transform duration-200 ${isOpenMenu ? 'rotate-180' : ''}`}>▼</span>
                                        </div>
                                    ) : (
                                        <Link href={item.path!} className="flex items-center gap-3 w-full">
                                            <span className="text-lg opacity-80 group-hover:opacity-100">{item.icon}</span>
                                            <span className="font-medium text-sm">{item.title}</span>
                                        </Link>
                                    )}
                                </div>

                                {hasSubItems && isOpenMenu && (
                                    <div className="mt-1 ml-4 border-l-2 border-stone-800 pl-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                        {item.subItems!.map((sub) => {
                                            const isSubActive = pathname === sub.path;
                                            return (
                                                <Link
                                                    key={sub.path}
                                                    href={sub.path}
                                                    className={`
                                                        block px-3 py-2 rounded-md text-sm transition-colors
                                                        ${isSubActive
                                                        ? 'text-amber-400 font-medium bg-stone-800/50'
                                                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'}
                                                    `}
                                                >
                                                    {sub.title}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-stone-800 shrink-0">
                    <button className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-md transition-colors text-sm font-medium">
                        <span>🚪</span> Çıkış Yap
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;