// src/components/ui/Book/Pagination.tsx

import React from 'react';

interface PaginationProps {
    page: number;           // Şu anki sayfa (0-indexed)
    totalPages: number;     // Toplam sayfa sayısı
    onPageChange: (newPage: number) => void; // Sayfa değişim fonksiyonu
    //setPage: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    console.log("Rendering Pagination: ", { page, totalPages });
    if (totalPages <= 1) return null;

    const hasPrevious = page > 1;
    const hasNext = page <= totalPages - 1;

    return (
        <div className="mt-8 flex justify-center gap-4">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={!hasPrevious}
                className={`px-4 py-2 border rounded flex items-center gap-2 transition
                    ${hasPrevious
                    ? 'bg-white border-amber-300 text-amber-900 hover:bg-amber-50 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}
            >
                &larr; Önceki
            </button>

            <span className="px-4 py-2 text-amber-900 font-serif bg-white border border-transparent">
                Sayfa {page} / {totalPages}
            </span>

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={!hasNext}
                className={`px-4 py-2 border rounded flex items-center gap-2 transition
                    ${hasNext
                    ? 'bg-white border-amber-300 text-amber-900 hover:bg-amber-50 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}
            >
                Sonraki &rarr;
            </button>
        </div>
    );
}