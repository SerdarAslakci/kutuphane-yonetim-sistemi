import React from 'react';

interface Props {
    isOpen: boolean;
    onClick: () => void;
}

export default function MobileFilterButton({ isOpen, onClick }: Props) {
    return (
        <div className="lg:hidden">
            <button
                onClick={onClick}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium shadow-sm transition-all
                    ${isOpen
                    ? 'bg-stone-800 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-300'
                }`}
            >
                <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="4" x2="14" y2="4"></line><line x1="10" y1="4" x2="3" y2="4"></line><line x1="21" y1="12" x2="12" y2="12"></line><line x1="8" y1="12" x2="3" y2="12"></line><line x1="21" y1="20" x2="16" y2="20"></line><line x1="12" y1="20" x2="3" y2="20"></line><line x1="14" y1="2" x2="14" y2="6"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="16" y1="18" x2="16" y2="22"></line></svg>
                    Filtrele ve Sırala
                </span>
                <span>{isOpen ? 'Kapat ✕' : 'Göster ▼'}</span>
            </button>
        </div>
    );
}