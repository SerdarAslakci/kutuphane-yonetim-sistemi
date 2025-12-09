'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AddBookCopyModal from '@/src/components/ui/Admin/Modals/AddBookCopyModal';
import ManageBookCopiesModal from "@/src/components/ui/Admin/Modals/ManageBookCopiesModal";
import UpdateBookModal from '@/src/components/ui/Admin/Modals/UpdateBookModal';
import DeleteConfirmationModal from '@/src/components/ui/Admin/Modals/DeleteConfirmationModal';

import { bookService } from '@/src/services/bookService';
import { categoryService } from '@/src/services/categoryService';
import { Book, BookFilterDto } from '@/src/types/book';
import { Category } from "@/src/types/category";

export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Kategoriler yüklenemedi", error);
            }
        };
        fetchCategories();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const filterDto: BookFilterDto = {
                title: searchTerm || undefined,
                categoryId: selectedCategory,
                page: page,
                size: pageSize
            };

            const result = await bookService.getAllBooks(filterDto);

            setBooks(result.items || []);
            setTotalCount(result.totalCount || 0);
        } catch (error) {
            console.error("Kitaplar yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if(searchTerm.trim() === "") {
            fetchBooks();
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            setPage(1);
            handleSearch();
        }, 500);
        return () => clearTimeout(delayDebounceFn);

    }, [searchTerm, selectedCategory]);

    useEffect(() => {
        fetchBooks();
    }, [page]);

    const handleSearch = async () => {
        setPage(1);
        try{
            const result = await bookService.getBookByName(searchTerm);

            setBooks(result);
            setTotalCount(result.length);
        }catch(err){
            console.error("Kitap arama hatası:", err);
        }
        //fetchBooks();
    };
    const handleOpenCopyModal = (book: Book) => { setSelectedBook(book); setIsModalOpen(true); };
    const handleOpenManageModal = (book: Book) => { setSelectedBook(book); setIsManageModalOpen(true); };
    const handleOpenUpdateModal = (book: Book) => { setSelectedBook(book); setIsUpdateModalOpen(true); };
    const handleOpenDeleteModal = (book: Book) => { setSelectedBook(book); setIsDeleteModalOpen(true); };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsManageModalOpen(false);
        setIsUpdateModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedBook(null);
    };

    const handleUpdateSuccess = () => {
        fetchBooks();
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-stone-800 font-serif">Kitap Yönetimi</h1>
                    <p className="text-stone-500 text-sm">Toplam {totalCount} kitap listeleniyor.</p>
                </div>
                <Link
                    href="/admin/books/add"
                    className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
                >
                    <span>➕</span> Yeni Kitap Ekle
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Kitap Adı Ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-stone-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 placeholder-stone-400"
                    />
                </div>

                <select
                    value={selectedCategory ?? ""}
                    onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-600 bg-white w-full md:w-[200px]"
                >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => fetchBooks()}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-6 py-2 rounded text-sm font-medium transition-colors w-full md:w-auto"
                >
                    Yenile
                </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">

                <div className="md:hidden divide-y divide-stone-100">
                    {loading && <div className="p-8 text-center text-stone-500">Yükleniyor...</div>}
                    {!loading && books.length === 0 && <div className="p-8 text-center text-stone-500 italic">Kayıt bulunamadı.</div>}

                    {!loading && books.map((book) => {
                        const copyCount = book.bookCopies?.length || 0;
                        return (
                            <div key={book.id} className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-stone-800">{book.title}</h3>
                                        <p className="text-xs text-stone-500">ISBN: {book.isbn}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                        copyCount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {copyCount} Adet
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 border-t border-stone-50 pt-2">
                                    <div>
                                        <span className="block font-bold text-stone-400 text-[10px] uppercase">Yazar</span>
                                        {book.bookAuthors && book.bookAuthors.length > 0 ? (
                                            book.bookAuthors.map(ba => `${ba.author.firstName} ${ba.author.lastName}`).join(", ")
                                        ) : "Bilinmiyor"}
                                    </div>
                                    <div>
                                        <span className="block font-bold text-stone-400 text-[10px] uppercase">Kategori</span>
                                        {book.category?.name || book.categoryName || "Genel"}
                                    </div>
                                    <div>
                                        <span className="block font-bold text-stone-400 text-[10px] uppercase">Yıl</span>
                                        {book.publicationYear}
                                    </div>
                                    <div>
                                        <span className="block font-bold text-stone-400 text-[10px] uppercase">ID</span>
                                        #{book.id}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-1">
                                    <button onClick={() => handleOpenCopyModal(book)} className="flex-1 bg-stone-100 text-amber-800 border border-stone-200 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1">
                                        📥 Ekle
                                    </button>
                                    <button onClick={() => handleOpenManageModal(book)} className="flex-1 bg-stone-100 text-amber-800 border border-stone-200 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1">
                                        📋 Yönet
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenUpdateModal(book)} className="flex-1 text-center text-stone-500 bg-stone-50 py-1.5 rounded border border-stone-100 text-xs font-medium">Düzenle</button>
                                    <button onClick={() => handleOpenDeleteModal(book)} className="flex-1 text-center text-red-600 bg-red-50 py-1.5 rounded border border-red-100 text-xs font-medium">Sil</button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <table className="hidden md:table w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-xs border-b border-stone-200">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Kitap Adı</th>
                        <th className="px-6 py-3">Yazar(lar)</th>
                        <th className="px-6 py-3">Kategori</th>
                        <th className="px-6 py-3">Yayın Yılı</th>
                        <th className="px-6 py-3 text-center">Kopya (Stok)</th>
                        <th className="px-6 py-3 text-right">İşlemler</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">

                    {loading && (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                            <span className="inline-block animate-spin text-amber-600 mr-2">↻</span>
                            Kitaplar yükleniyor...
                        </td></tr>
                    )}

                    {!loading && books.length === 0 && (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-500 italic">
                            Aradığınız kriterlere uygun kitap bulunamadı.
                        </td></tr>
                    )}

                    {!loading && books.map((book) => {
                        const copyCount = book.bookCopies?.length || 0;

                        return (
                            <tr key={book.id} className="hover:bg-amber-50/30 transition-colors group">
                                <td className="px-6 py-4 font-mono text-stone-400">#{book.id}</td>

                                <td className="px-6 py-4 font-bold text-stone-800">
                                    {book.title}
                                    <div className="text-[10px] text-stone-400 font-normal">{book.isbn}</div>
                                </td>

                                <td className="px-6 py-4 text-stone-600">
                                    {book.bookAuthors && book.bookAuthors.length > 0 ? (
                                        book.bookAuthors.map(ba => `${ba.author.firstName} ${ba.author.lastName}`).join(", ")
                                    ) : (
                                        (book.authorFirstName && book.authorLastName)
                                            ? `${book.authorFirstName} ${book.authorLastName}`
                                            : <span className="text-stone-400 italic">Bilinmiyor</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs">
                                        {book.category?.name || book.categoryName || "Genel"}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-stone-600">
                                    {book.publicationYear}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        copyCount > 0
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {copyCount} Adet
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleOpenCopyModal(book)}
                                        className="bg-stone-100 hover:bg-amber-100 text-amber-800 border border-stone-200 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                                        title="Hızlı Kopya Ekle"
                                    >
                                        <span>📥</span> <span className="hidden lg:inline">Kopya Ekle</span>
                                    </button>

                                    <button
                                        onClick={() => handleOpenManageModal(book)}
                                        className="bg-stone-100 hover:bg-amber-100 text-amber-800 border border-stone-200 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                                        title="Kopyaları Düzenle/Sil"
                                    >
                                        <span>📋</span> <span className="hidden lg:inline">Yönet</span>
                                    </button>

                                    <div className="h-4 w-px bg-stone-300 mx-1"></div>
                                    <button onClick={() => handleOpenUpdateModal(book)} className="text-stone-400 hover:text-amber-700 transition-colors font-medium">✏️</button>
                                    <button onClick={() => handleOpenDeleteModal(book)} className="text-stone-400 hover:text-red-700 transition-colors font-medium">🗑️</button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {!loading && totalCount > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                    <span className="text-xs text-stone-500 order-2 sm:order-1">
                        Toplam {Math.ceil(totalCount / pageSize)} sayfa ({totalCount} kayıt)
                    </span>
                    <div className="flex gap-2 order-1 sm:order-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border text-black rounded text-xs disabled:opacity-50 hover:bg-stone-100"
                        >
                            ← Önceki
                        </button>
                        <span className="px-3 py-1 bg-stone-100 rounded text-xs font-bold text-stone-700">
                            {page}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={books.length < pageSize}
                            className="px-3 py-1 border text-black rounded text-xs disabled:opacity-50 hover:bg-stone-100"
                        >
                            Sonraki →
                        </button>
                    </div>
                </div>
            )}

            <AddBookCopyModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                book={selectedBook}
            />
            <ManageBookCopiesModal
                isOpen={isManageModalOpen}
                onClose={handleCloseModal}
                book={selectedBook}
                onUpdate={handleUpdateSuccess}
            />
            <UpdateBookModal
                isOpen={isUpdateModalOpen}
                onClose={handleCloseModal}
                book={selectedBook}
                onSuccess={fetchBooks}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModal}
                bookId={selectedBook?.id || 0}
                bookTitle={selectedBook?.title || ''}
                onSuccess={fetchBooks}
            />
        </div>
    );
}