'use client';

import React from 'react';

// --- SKELETON COMPONENT ---
const BookDetailSkeleton = () => {
    return (
        <main className="container mx-auto px-4 py-8 animate-pulse">
            {/* Back Button Skeleton */}
            <div className="h-4 w-24 bg-stone-200 rounded mb-6"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SOL KOLON SKELETON */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. BookInfoCard Skeleton */}
                    <div className="bg-white border border-stone-200 rounded-lg p-6 flex flex-col md:flex-row gap-8">
                        {/* Resim Alanı */}
                        <div className="w-full md:w-48 shrink-0">
                            <div className="aspect-[2/3] w-full bg-stone-200 rounded-md"></div>
                        </div>
                        {/* Yazı Alanı */}
                        <div className="flex-1 space-y-4 py-2">
                            <div className="h-6 w-24 bg-stone-200 rounded-full"></div> {/* Kategori */}
                            <div className="h-10 w-3/4 bg-stone-300 rounded"></div> {/* Başlık */}
                            <div className="h-6 w-1/2 bg-stone-200 rounded"></div> {/* Yazar */}
                            <div className="space-y-2 mt-6">
                                <div className="h-4 w-full bg-stone-200 rounded"></div>
                                <div className="h-4 w-full bg-stone-200 rounded"></div>
                                <div className="h-4 w-2/3 bg-stone-200 rounded"></div>
                            </div>
                        </div>
                    </div>

                    {/* 2. CopyStatusList Skeleton */}
                    <div className="bg-white border border-stone-200 rounded-lg p-6">
                        <div className="flex justify-between mb-4">
                            <div className="h-6 w-40 bg-stone-300 rounded"></div>
                            <div className="h-6 w-24 bg-stone-200 rounded-full"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-10 w-full bg-stone-100 rounded"></div>
                            <div className="h-10 w-full bg-stone-100 rounded"></div>
                            <div className="h-10 w-full bg-stone-100 rounded"></div>
                        </div>
                    </div>

                    {/* 3. BookReviews Skeleton */}
                    <div className="bg-white border border-stone-200 rounded-lg p-6">
                        <div className="h-6 w-32 bg-stone-300 rounded mb-6"></div>
                        <div className="flex gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-stone-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-stone-300 rounded"></div>
                                <div className="h-4 w-full bg-stone-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAĞ KOLON SKELETON */}
                <div className="lg:col-span-1 space-y-6">
                    {/* 1. Metadata Skeleton */}
                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 h-fit">
                        <div className="h-6 w-32 bg-stone-300 rounded mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-10 bg-stone-200 rounded"></div>
                            <div className="h-10 bg-stone-200 rounded"></div>
                            <div className="h-10 bg-stone-200 rounded"></div>
                            <div className="h-10 bg-stone-200 rounded"></div>
                        </div>
                    </div>

                    {/* 2. Other Books Skeleton */}
                    <div className="bg-white border border-stone-200 rounded-lg p-5">
                        <div className="h-5 w-40 bg-stone-300 rounded mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-12 h-16 bg-stone-200 rounded shrink-0"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-3 w-3/4 bg-stone-200 rounded"></div>
                                        <div className="h-3 w-1/2 bg-stone-100 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BookDetailSkeleton;