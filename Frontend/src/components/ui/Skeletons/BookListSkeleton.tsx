const BookListSkeleton = () => {
    return (
        <div className="w-full">
            {/* Üstteki Sonuç Bilgisi Alanı Skeleton */}
            <div className="h-6 w-48 bg-stone-200 rounded mb-6 animate-pulse"></div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col animate-pulse shadow-sm">
                        {/* Kapak Resmi Alanı (2/3 oranında) */}
                        <div className="w-full aspect-[2/3] bg-stone-200 rounded-md mb-4"></div>

                        {/* Başlık Satırı */}
                        <div className="h-4 bg-stone-300 rounded w-3/4 mb-2"></div>

                        {/* Yazar Satırı */}
                        <div className="h-3 bg-stone-200 rounded w-1/2 mb-4"></div>

                        {/* Alt Buton Alanı */}
                        <div className="mt-auto pt-3 border-t border-stone-100">
                            <div className="h-8 bg-stone-100 rounded w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookListSkeleton;