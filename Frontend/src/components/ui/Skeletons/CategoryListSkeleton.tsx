const CategoryListSkeleton = () => {
    return (
        <div className="space-y-3 mt-1 animate-pulse">
            {/* 6 adet sahte kategori satırı oluşturuyoruz */}
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                    {/* Kategori Adı Çizgisi */}
                    <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                    {/* Sayı (Count) Çizgisi */}
                    <div className="h-3 bg-stone-100 rounded w-6"></div>
                </div>
            ))}
        </div>
    );
};

export default CategoryListSkeleton;