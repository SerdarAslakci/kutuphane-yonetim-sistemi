'use client';

import React, { useEffect, useState } from 'react';
import {Book} from "@/src/types/book"
import { bookService } from '@/src/services/bookService';
import Link from 'next/link';

interface Props {
    authorId: number;
    authorName: string;
    categoryId: number;
    currentBookId: number;
}

const AuthorOtherBooks = ({ authorId, authorName, categoryId, currentBookId }: Props) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const result = await bookService.getBooksByAuthor(authorId, currentBookId, categoryId);

                console.log("Diğer kitaplar:", result);
                setBooks(result);
            } catch (error) {
                console.error("Diğer kitaplar mevcut degil.");
            } finally {
                setLoading(false);
            }
        };

        if (authorId) {
            fetchBooks();
        }
    }, [authorId, currentBookId]);

    if (loading) return <div className="animate-pulse h-32 bg-stone-100 rounded mt-6"></div>;

    // Eğer yazarın başka kitabı yoksa bu bloğu hiç gösterme
    if (books.length === 0) return null;

    return (
        <div className="bg-white border border-stone-200 rounded-lg p-5 mt-6 shadow-sm">
            <h3 className="font-serif font-bold text-md text-amber-950 mb-4 border-b border-stone-100 pb-2">
                Yazarın Diğer Kitapları
            </h3>

            <div className="flex flex-col gap-4">
                {books.map((book) => (
                    <Link
                        href={`/book/${book.id}`}
                        key={book.id}
                        className="group flex gap-3 items-start hover:bg-stone-50 p-2 rounded transition-colors"
                    >
                        {/* Küçük Kapak Resmi */}
                        <div className="w-12 h-16 bg-stone-200 rounded border border-stone-300 flex items-center justify-center shrink-0 overflow-hidden">
                            {/* Resim varsa buraya img koy */}
                            <span className="text-[10px] text-stone-400 font-serif text-center px-1">
                                {book.title?.substring(0, 10)}...
                            </span>
                        </div>

                        {/* Bilgiler */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-stone-800 text-sm group-hover:text-amber-800 transition-colors truncate">
                                {book.title}
                            </h4>
                            <p className="text-xs text-stone-500 mt-1">
                                {book.publicationYear} • {book.categoryName || "Genel"}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 text-center">
                <Link
                    href={`/?author=${encodeURIComponent(authorName)}`}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900"
                >
                    Tümünü Gör →
                </Link>
            </div>
        </div>
    );
};

export default AuthorOtherBooks;