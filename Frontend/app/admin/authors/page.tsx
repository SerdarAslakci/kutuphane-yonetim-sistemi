'use client';

import React, {useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import { authorService } from '@/src/services/authorService';
import { Author } from '@/src/types/publisherAndAuthor';
import PaginationControls from '@/src/components/ui/Admin/Common/PaginationControls';

import GenericDeleteModal from "@/src/components/ui/Admin/Modals/GenericDeleteModal";
import AddAuthorModal from "@/src/components/ui/Admin/Modals/AddAuthorModal";
import UpdateAuthorModal from "@/src/components/ui/Admin/Modals/UpdateAuthorModal";

export default function AdminAuthorsPage() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [firstNameFilter, setFirstNameFilter] = useState("");
    const [lastNameFilter, setLastNameFilter] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const result = await authorService.getAllAuthorPageable(page, pageSize);
            if (result && Array.isArray(result.items)) {
                setAuthors(result.items);
                setTotalCount(result.totalCount || 0);
            } else {
                setAuthors([]);
                setTotalCount(0);
            }
        } catch (error) {
            toast.error("Yazar listesi yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const searchAuthors = async () => {
        setLoading(true);
        try {
            const result = await authorService.getAuthorByNameAndLastName(firstNameFilter, lastNameFilter);
            if (Array.isArray(result)) {
                setAuthors(result);
                setTotalCount(result.length);
                setIsSearching(true);
            } else {
                setAuthors([]);
                setTotalCount(0);
            }
        } catch (error) {
            setAuthors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (firstNameFilter.trim() === "" && lastNameFilter.trim() === "") {
            setIsSearching(false);
            fetchAuthors();
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            setPage(1);
            searchAuthors();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [firstNameFilter, lastNameFilter]);

    useEffect(() => {
        if (!isSearching) fetchAuthors();
    }, [page]);

    const handleClearFilters = () => {
        setFirstNameFilter("");
        setLastNameFilter("");
        setIsSearching(false);
    };

    const openDeleteModal = (author: Author) => {
        setSelectedAuthor(author);
        setIsDeleteModalOpen(true);
    };

    const openUpdateModal = (author: Author) => {
        setSelectedAuthor(author);
        setIsUpdateModalOpen(true);
    };

    const handleOperationSuccess = () => {
        if (isSearching) searchAuthors();
        else fetchAuthors();
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-stone-800 font-serif">Yazar Yönetimi</h1>
                    <p className="text-stone-500 text-sm">Toplam {totalCount} yazar listeleniyor.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <span>➕</span> Yeni Yazar Ekle
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Ad ile ara..."
                        value={firstNameFilter}
                        onChange={(e) => setFirstNameFilter(e.target.value)}
                        className="w-full border border-stone-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 transition-all"
                    />
                </div>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Soyad ile ara..."
                        value={lastNameFilter}
                        onChange={(e) => setLastNameFilter(e.target.value)}
                        className="w-full border border-stone-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 transition-all"
                    />
                </div>
                <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded border border-stone-200 hover:border-stone-300 transition-all w-full md:w-auto"
                >
                    Temizle
                </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">

                <div className="md:hidden divide-y divide-stone-100">
                    {loading && <div className="p-8 text-center text-stone-500">Yükleniyor...</div>}
                    {!loading && authors.length === 0 && <div className="p-8 text-center text-stone-500 italic">Kayıt bulunamadı.</div>}

                    {!loading && authors.map((author) => (
                        <div key={author.id} className="p-4 flex flex-col gap-3 bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-stone-800">{author.firstName} {author.lastName}</h3>
                                    <span className="text-xs text-stone-400 font-mono">ID: #{author.id}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-1 pt-3 border-t border-stone-50">
                                <button
                                    onClick={() => openUpdateModal(author)}
                                    className="flex-1 text-center text-amber-700 bg-amber-50 py-2 rounded border border-amber-100 text-xs font-bold active:scale-95 transition-transform"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => openDeleteModal(author)}
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
                        <th className="px-6 py-3">Ad</th>
                        <th className="px-6 py-3">Soyad</th>
                        <th className="px-6 py-3 text-right">İşlemler</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                    {loading && (
                        <tr><td colSpan={4} className="p-8 text-center text-stone-500">Yükleniyor...</td></tr>
                    )}

                    {!loading && authors.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-stone-500 italic">Kayıt bulunamadı.</td></tr>
                    )}

                    {!loading && authors.map((author) => (
                        <tr key={author.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-stone-400">#{author.id}</td>
                            <td className="px-6 py-4 font-bold text-stone-800">{author.firstName}</td>
                            <td className="px-6 py-4 text-stone-800">{author.lastName}</td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button
                                    onClick={() => openUpdateModal(author)}
                                    className="text-stone-400 hover:text-amber-700 transition-colors font-medium"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => openDeleteModal(author)}
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

            {!loading && !isSearching && totalCount > 0 && (
                <div className="overflow-x-auto">
                    <PaginationControls
                        currentPage={page}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <AddAuthorModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleOperationSuccess}
            />
            <GenericDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                entityId={selectedAuthor?.id || 0}
                entityName={`${selectedAuthor?.firstName} ${selectedAuthor?.lastName}`}
                entityType="Yazar"
                onDeleteService={authorService.deleteAuthor}
                onSuccess={handleOperationSuccess}
            />
            <UpdateAuthorModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                author={selectedAuthor}
                onSuccess={handleOperationSuccess}
            />
        </div>
    );
}