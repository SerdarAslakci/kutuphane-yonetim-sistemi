import React from 'react';

interface ResultsInfoProps {
    totalCount: number;
}

export default function ResultsInfo({ totalCount }: ResultsInfoProps) {
    return (
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-6 flex flex-col sm:flex-row justify-between items-center shadow-sm gap-4">
            <h2 className="font-serif font-semibold text-amber-900 text-lg">
                Arama Sonuçları: <span className="text-amber-700 font-bold ml-1">{totalCount} Eser bulundu</span>
            </h2>
        </div>
    );
}