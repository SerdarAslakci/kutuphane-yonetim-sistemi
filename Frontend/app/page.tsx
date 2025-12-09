'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

import Header from "@/src/components/ui/Header";
import Sidebar from "@/src/components/ui/Sidebar";
import BookGrid from "@/src/components/ui/Book/BookGrid";
import Pagination from "@/src/components/ui/Book/Pagination";
import ResultsInfo from "@/src/components/ui/Book/ResultsInfo";

import AuthenticatedBanner from "@/src/components/ui/Home/AuthenticatedBanner";
import GuestBanner from "@/src/components/ui/Home/GuestBanner";
import MobileFilterButton from "@/src/components/ui/Home/MobileFilterButton";
import QuickActionButtons from "@/src/components/ui/Home/QuickActionButtons";
import BorrowBookModal from "@/src/components/ui/Book/BorrowBookModal";
import ReturnBookModal from "@/src/components/ui/Book/ReturnBookModal";

import { bookService } from "@/src/services/bookService";
import { BookFilterDto, Book } from "@/src/types/book";

const BACKGROUND_IMAGE = "https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?cs=srgb&dl=pexels-technobulka-2908984.jpg&fm=jpg";

function HomeContent() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const searchParams = useSearchParams();

    const pageParam = searchParams?.get("page") ?? "1";
    const page = parseInt(pageParam, 10) || 1;
    const size = 12;

    const [books, setBooks] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const filter: BookFilterDto = {
            page: page,
            size: size,
            title: (searchParams?.get("title") as string) || undefined,

            categoryId: searchParams?.get("categoryId") ? parseInt(searchParams.get("categoryId") as string) : undefined,
            authorId: searchParams?.get("authorId") ? parseInt(searchParams.get("authorId") as string) : undefined,
            publisherId: searchParams?.get("publisherId") ? parseInt(searchParams.get("publisherId") as string) : undefined,

            publicationYearFrom: searchParams?.get("yearMin") ? parseInt(searchParams.get("yearMin") as string) : undefined,
            publicationYearTo: searchParams?.get("yearMax") ? parseInt(searchParams.get("yearMax") as string) : undefined,

            pageCountMin: searchParams?.get("pageCountMin") ? parseInt(searchParams.get("pageCountMin") as string) : undefined,
            pageCountMax: searchParams?.get("pageCountMax") ? parseInt(searchParams.get("pageCountMax") as string) : undefined,

            language: (searchParams?.get("language") as string) || undefined,
            hasAvailableCopy: searchParams?.get("hasAvailableCopy") === 'true' ? true : undefined,
            roomCode: (searchParams?.get("roomCode") as string) || undefined
        };

        let mounted = true;
        setLoading(true);

        (async () => {
            try {
                const result = await bookService.getAllBooks(filter);
                if (!mounted) return;
                setBooks(result.items || []);
                setTotalCount(result.totalCount || 0);
                setTotalPages(result.totalPages || 0);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [searchParams, page]);

    return (
        <div className="min-h-screen bg-[#F5F5F4] flex flex-col font-sans relative isolate">
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
                <div
                    className="w-[1000px] h-[1000px] md:w-[2000px] md:h-[2000px] bg-no-repeat bg-center bg-contain opacity-[1]"
                    style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
                >
                </div>
            </div>
            <Suspense fallback={<div className="bg-white h-16 border-b border-stone-200"></div>}>
                <Header />
            </Suspense>

            <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 transition-all">

                <MobileFilterButton isOpen={showMobileFilters} onClick={() => setShowMobileFilters(!showMobileFilters)} />

                <aside className={`lg:block lg:w-72 shrink-0 transition-all duration-300 ease-in-out z-20 ${showMobileFilters ? 'block' : 'hidden'}`}>
                    <div className="sticky top-24">
                        <Suspense fallback={<div className="w-full h-96 bg-stone-200 animate-pulse rounded-xl"></div>}>
                            <Sidebar />
                        </Suspense>
                    </div>
                </aside>

                <section className="flex-1 min-w-0">

                    {isAuthenticated && user ? (
                        <>
                            <AuthenticatedBanner
                                user={user}
                                totalBookCount={totalCount}
                                onProfileClick={() => router.push('/profile')}
                            />

                            <QuickActionButtons
                                onBorrowClick={() => setIsBorrowModalOpen(true)}
                                onReturnClick={() => setIsReturnModalOpen(true)}
                            />
                        </>
                    ) : (
                        <GuestBanner />
                    )}

                    <div className="flex flex-col gap-4">
                        <ResultsInfo totalCount={totalCount} />
                        <BookGrid books={books} loading={loading} />
                    </div>

                    {!loading && totalCount > 0 && (
                        <div className="mt-10 flex justify-center pb-8">
                            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    )}
                </section>
            </main>

            <BorrowBookModal
                isOpen={isBorrowModalOpen}
                onClose={() => setIsBorrowModalOpen(false)}
                bookTitle="Hızlı Ödünç İşlemi"
                onSuccess={() => {}}
            />

            <ReturnBookModal
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
            />
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
            </div>
        }>
            <HomeContent />
        </Suspense>
    );
}