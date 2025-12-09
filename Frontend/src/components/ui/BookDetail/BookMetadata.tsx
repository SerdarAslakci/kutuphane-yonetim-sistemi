import React from 'react';
import {BookDetail} from "@/src/types/bookDetail";

const BookMetadata = ({ book }: { book: BookDetail }) => {
    return (
        <div className="bg-stone-50 border border-amber-200/60 rounded-lg p-6 h-fit">
            <h3 className="font-serif font-bold text-xl text-amber-950 mb-4 flex items-center gap-2">
                <span>📖</span> Kitap Künyesi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex flex-col border-b border-stone-200 pb-2">
                    <span className="text-stone-500 font-medium text-xs uppercase">ISBN</span>
                    <span className="text-stone-800 font-mono">{book.isbn}</span>
                </div>

                <div className="flex flex-col border-b border-stone-200 pb-2">
                    <span className="text-stone-500 font-medium text-xs uppercase">Yayın Yılı</span>
                    <span className="text-stone-800 font-bold">{book.publicationYear}</span>
                </div>

                <div className="flex flex-col border-b border-stone-200 pb-2">
                    <span className="text-stone-500 font-medium text-xs uppercase">Sayfa Sayısı</span>
                    <span className="text-stone-800">{book.pageCount} Syf.</span>
                </div>

                <div className="flex flex-col border-b border-stone-200 pb-2">
                    <span className="text-stone-500 font-medium text-xs uppercase">Dil</span>
                    <span className="text-stone-800">{book.language}</span>
                </div>

                <div className="flex flex-col border-b border-stone-200 pb-2 sm:col-span-2">
                    <span className="text-stone-500 font-medium text-xs uppercase">Yayınevi</span>
                    <span className="text-stone-800 font-bold">{book.publisher?.name || "-"}</span>
                </div>
            </div>
        </div>
    );
};

export default BookMetadata;