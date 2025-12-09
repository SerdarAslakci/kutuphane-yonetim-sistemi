'use client';
import React from 'react';

interface Props {
    onBorrowClick: () => void;
    onReturnClick: () => void;
}

export default function QuickActionButtons({ onBorrowClick, onReturnClick }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
                onClick={onBorrowClick}
                className="group relative overflow-hidden bg-white border border-stone-200 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-left flex items-center gap-4"
            >
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📚
                </div>
                <div>
                    <h3 className="font-serif font-bold text-stone-800 text-lg group-hover:text-amber-800 transition-colors">Kitap Ödünç Al</h3>
                    <p className="text-stone-500 text-sm mt-1">Barkod okutarak hızlıca kitap verin.</p>
                </div>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </button>

            <button
                onClick={onReturnClick}
                className="group relative overflow-hidden bg-white border border-stone-200 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-green-300 transition-all text-left flex items-center gap-4"
            >
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    ↩️
                </div>
                <div>
                    <h3 className="font-serif font-bold text-stone-800 text-lg group-hover:text-green-800 transition-colors">Kitap İade Et</h3>
                    <p className="text-stone-500 text-sm mt-1">Kitabı teslim alın ve süreci tamamlayın.</p>
                </div>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </button>
        </div>
    );
}