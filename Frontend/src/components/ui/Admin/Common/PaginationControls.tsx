import React from 'react';

interface Props {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
}

export default function PaginationControls({ currentPage, totalCount, pageSize, onPageChange }: Props) {
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-stone-500">
                Sayfa {currentPage} / {totalPages || 1} (Toplam {totalCount} kayıt)
            </span>
            <div className="flex gap-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-1 border rounded text-xs disabled:opacity-50 hover:bg-stone-100 text-black transition-colors"
                >
                    ← Önceki
                </button>
                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-1 border rounded text-xs disabled:opacity-50 hover:bg-stone-100 text-black transition-colors"
                >
                    Sonraki →
                </button>
            </div>
        </div>
    );
}