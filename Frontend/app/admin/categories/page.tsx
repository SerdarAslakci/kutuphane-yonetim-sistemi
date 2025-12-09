'use client';

import React, {useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import {categoryService} from '@/src/services/categoryService';
import {Category} from '@/src/types/category';

import AddCategoryModal from '@/src/components/ui/Admin/Modals/AddCategoryModal';
import UpdateCategoryModal from "@/src/components/ui/Admin/Modals/UpdateCategoryModal";
import GenericDeleteModal from '@/src/components/ui/Admin/Modals/GenericDeleteModal';

import PaginationControls from '@/src/components/ui/Admin/Common/PaginationControls';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const result = await categoryService.getCategoriesPageable(page, pageSize);
            console.log("Sayfalı Kategori Sonucu:", result);

            if (result && Array.isArray(result.items)) {
                setCategories(result.items);
                setTotalCount(result.totalCount || 0);
            } else {
                setCategories([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("Kategoriler yüklenemedi", error);
            toast.error("Liste yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const searchCategory = async (name: string) => {
        setLoading(true);
        try {
            const result = await categoryService.getCategoryByName(name);
            if (Array.isArray(result)) {
                setCategories(result);
                setTotalCount(result.length);
            } else if (result) {
                setCategories([result]);
                setTotalCount(1);
            } else {
                setCategories([]);
                setTotalCount(0);
            }
        } catch (error) {
            setCategories([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() === "") {
            fetchCategories();
        }
    }, [page]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            fetchCategories();
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            searchCategory(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleOpenUpdateModal = (category: Category) => {
        setSelectedCategory(category);
        setIsUpdateModalOpen(true);
    };
    const handleOpenDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };
    const handleSuccess = () => {
        if (searchTerm) searchCategory(searchTerm); else fetchCategories();
    };

    const handleCloseModals = () => {
        setIsAddModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-stone-800 font-serif">Kategori Yönetimi</h1>
                    <p className="text-stone-500 text-sm">Toplam {totalCount} kategori listeleniyor.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <span>➕</span> Yeni Kategori Ekle
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                <div className="relative w-full md:w-1/3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Kategori adı ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-stone-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 placeholder-stone-400 transition-all"
                    />
                </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">

                <div className="md:hidden divide-y divide-stone-100">
                    {loading && <div className="p-8 text-center text-stone-500">Yükleniyor...</div>}
                    {!loading && categories.length === 0 && <div className="p-8 text-center text-stone-500 italic">Kayıt bulunamadı.</div>}

                    {!loading && categories.map((category) => (
                        <div key={category.id} className="p-4 flex flex-col gap-3 bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-stone-800">{category.name}</h3>
                                    <span className="text-xs text-stone-400 font-mono">ID: #{category.id}</span>
                                </div>
                                <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                    {category.bookCount ?? 0} Kitap
                                </span>
                            </div>

                            <div className="flex gap-2 mt-1 pt-3 border-t border-stone-50">
                                <button
                                    onClick={() => handleOpenUpdateModal(category)}
                                    className="flex-1 text-center text-amber-700 bg-amber-50 py-2 rounded border border-amber-100 text-xs font-bold active:scale-95 transition-transform"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleOpenDeleteModal(category)}
                                    className="flex-1 text-center text-red-700 bg-red-50 py-2 rounded border border-red-100 text-xs font-bold active:scale-95 transition-transform"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <table className="hidden md:table w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-xs border-b border-stone-200">
                    <tr>
                        <th className="px-6 py-3 w-20">ID</th>
                        <th className="px-6 py-3">Kategori Adı</th>
                        <th className="px-6 py-3 text-center w-32">Kitap Sayısı</th>
                        <th className="px-6 py-3 text-right">İşlemler</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">

                    {loading && (
                        <tr><td colSpan={4} className="p-8 text-center text-stone-500">Yükleniyor...</td></tr>
                    )}

                    {!loading && categories.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-stone-500 italic">Kayıt bulunamadı.</td></tr>
                    )}

                    {!loading && categories.map((category) => (
                        <tr key={category.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-stone-400">#{category.id}</td>
                            <td className="px-6 py-4 font-bold text-stone-800">{category.name}</td>
                            <td className="px-6 py-4 text-center">
                                <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-bold">
                                    {category.bookCount ?? 0}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button
                                    onClick={() => handleOpenUpdateModal(category)}
                                    className="text-stone-400 hover:text-amber-700 transition-colors font-medium"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleOpenDeleteModal(category)}
                                    className="text-stone-400 hover:text-red-700 transition-colors font-medium"
                                >
                                    Sil
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {!loading && searchTerm === "" && totalCount > 0 && (
                <div className="overflow-x-auto">
                    <PaginationControls
                        currentPage={page}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <AddCategoryModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModals}
                onSuccess={handleSuccess}
            />
            <UpdateCategoryModal
                key={selectedCategory ? selectedCategory.id : 'update-cat-modal'}
                isOpen={isUpdateModalOpen}
                onClose={handleCloseModals}
                category={selectedCategory}
                onSuccess={handleSuccess}
            />
            <GenericDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModals}
                entityId={selectedCategory?.id || 0}
                entityName={selectedCategory?.name || ''}
                entityType="Kategori"
                onDeleteService={categoryService.deleteCategory}
                onSuccess={handleSuccess}
            />
        </div>
    );
}