'use client';

import React, { useState } from 'react';
import { BookDetail } from "@/src/types/bookDetail";

interface Props {
    book: BookDetail;
    onBorrowClick: () => void;
}

const BookInfoCard = ({ book, onBorrowClick }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const authorNames = book.bookAuthors?.map(ba => `${ba.author.firstName} ${ba.author.lastName}`).join(", ") || "Yazar Bilgisi Yok";
    const hasAvailableCopy = book.bookCopies.some(c => c.isAvailable);
    const description = book.summary || "Bu kitap için henüz bir özet girilmemiştir. Kitap detayları aşağıda yer almaktadır.";

    return (
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">

            <div className="md:w-64 bg-stone-100 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-stone-200 shrink-0">
                <div className="relative w-40 md:w-48 aspect-[2/3] shadow-lg rounded-md overflow-hidden group">
                    <img
                        src={book.imageUrl} /*`https://picsum.photos/300/450?random=${book.id}`*/
                        alt={book.title || "Book cover"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Resim Yoksa Gösterilecek Fallback (Opsiyonel) */}
                    {!book.title && (
                        <div className="absolute inset-0 bg-stone-300 flex items-center justify-center text-stone-500 font-serif text-4xl">
                            ?
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide border border-amber-200">
                        {book.category?.name || "Genel"}
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-6 md:p-8">

                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-950 mb-2 leading-tight">
                        {book.title}
                    </h1>
                    <div className="flex items-center gap-2 text-lg text-stone-600 font-medium">
                        <span className="text-amber-700">✍️</span>
                        <span>{authorNames}</span>
                    </div>
                </div>

                <div className="flex-1 mb-6">
                    <h3 className="font-serif font-bold text-lg text-stone-800 mb-2 flex items-center gap-2">
                        📖 Kitap Özeti
                    </h3>
                    <div className="relative">
                        <p className={`text-stone-600 leading-relaxed text-sm md:text-base transition-all duration-300 ${!isExpanded ? 'line-clamp-4 md:line-clamp-6' : ''}`}>
                            {description}
                        </p>

                        {description.length > 250 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-amber-700 hover:text-amber-900 text-sm font-semibold mt-1 focus:outline-none hover:underline"
                            >
                                {isExpanded ? 'Daha Az Göster' : 'Devamını Oku...'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">

                    <div className="flex items-center gap-6 text-sm text-stone-500 w-full sm:w-auto justify-center sm:justify-start">
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-xs uppercase font-bold text-stone-400">Sayfa</span>
                            <span className="font-bold text-stone-800 text-lg">{book.pageCount}</span>
                        </div>
                        <div className="w-px h-8 bg-stone-200"></div>
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-xs uppercase font-bold text-stone-400">Yıl</span>
                            <span className="font-bold text-stone-800 text-lg">{book.publicationYear}</span>
                        </div>
                        <div className="w-px h-8 bg-stone-200"></div>
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-xs uppercase font-bold text-stone-400">Yayınevi</span>
                            <span className="font-bold text-stone-800 text-lg truncate max-w-[120px]" title={book.publisher.name}>
                                {book.publisher.name}
                            </span>
                        </div>
                    </div>

                    {!hasAvailableCopy && (
                        <div className="w-full sm:w-auto px-6 py-2 bg-amber-800 text-white rounded-lg font-bold border border-red-100 flex items-center justify-center gap-2 whitespace-nowrap select-none ">
                            <span>🚫</span>
                            <span>Tükendi</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookInfoCard;