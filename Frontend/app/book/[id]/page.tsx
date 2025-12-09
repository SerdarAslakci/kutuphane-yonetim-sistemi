'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from "@/src/components/ui/Header";
import { bookService } from "@/src/services/bookService";
import { BookDetail } from "@/src/types/bookDetail";
import { useAuth } from '@/src/hooks/useAuth';
import toast from 'react-hot-toast';

import BookInfoCard from '@/src/components/ui/BookDetail/BookInfoCard';
import BookMetadata from '@/src/components/ui/BookDetail/BookMetadata';
import CopyStatusList from '@/src/components/ui/BookDetail/CopyStatusList';
import BookReviews from '@/src/components/ui/BookDetail/BookReviews';
import AuthorOtherBooks from "@/src/components/ui/BookDetail/AuthorOtherBooks";
import BookDetailSkeleton from "@/src/components/ui/Skeletons/BookDetailSkeleton";

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const id = params?.id ? parseInt(params.id as string) : null;

    const [book, setBook] = useState<BookDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

    const [defaultBarcode, setDefaultBarcode] = useState<string>('');

    const primaryAuthor = book?.bookAuthors && book.bookAuthors.length > 0
        ? book.bookAuthors[0].author
        : null;

    const fetchBook = async () => {
        if (!id) return;
        try {
            const data = await bookService.getBookDetails(id);
            setBook(data);
        } catch (err) {
            console.error(err);
            setError("Kitap detayları yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchBook();
    }, [id]);

    const handleBorrowClick = () => {
        if (!isAuthenticated) {
            toast.error("Kitap ödünç alabilmek için lütfen giriş yapınız.");
            return;
        }

        if (book) {
            const availableCopy = book.bookCopies.find(c => c.isAvailable);

            if (availableCopy) {
                setDefaultBarcode(availableCopy.barcodeNumber || '');
            } else {
                setDefaultBarcode('');
            }
        }

        setIsBorrowModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
                <Header />
                <BookDetailSkeleton />
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
                <Header />
                <div className="container mx-auto px-4 py-8 text-center">
                    <h2 className="text-2xl font-bold text-red-800 mb-4">Hata</h2>
                    <p className="text-stone-600 mb-4">{error || "Kitap bulunamadı."}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded text-stone-800 transition">
                        Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-amber-800 hover:text-amber-950 flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                        ← Listeye Dön
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <BookInfoCard
                            book={book}
                            onBorrowClick={handleBorrowClick}
                        />

                        <CopyStatusList book={book} />

                        <BookReviews bookId={book.id} />
                    </div>

                    <div className="lg:col-span-1">
                        <BookMetadata book={book} />

                        {primaryAuthor && (
                            <AuthorOtherBooks
                                authorId={primaryAuthor.id}
                                authorName={`${primaryAuthor.firstName} ${primaryAuthor.lastName}`}
                                currentBookId={book.id}
                                categoryId={book.category.id}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}