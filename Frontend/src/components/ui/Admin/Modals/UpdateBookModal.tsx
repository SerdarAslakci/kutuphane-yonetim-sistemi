'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { bookService } from '@/src/services/bookService';
import { authorService } from '@/src/services/authorService';
import { publisherService } from '@/src/services/publisherService';
import { categoryService } from '@/src/services/categoryService';
import { Book, UpdateBookDto } from '@/src/types/book';
import { Author, Publisher } from '@/src/types/publisherAndAuthor';
import { Category } from '@/src/types/category';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onSuccess: () => void;
}

const DEFAULT_BOOK_IMAGE = "https://i.ibb.co/F47gc8Xk/unnamed.jpg";

export default function UpdateBookModal({ isOpen, onClose, book, onSuccess }: Props) {

    const getInitialAuthorId = (b: Book | null): number => {
        if (b?.bookAuthors && b.bookAuthors.length > 0) {
            return b.bookAuthors[0].authorId;
        }
        return b?.authorId || 0;
    };

    const [form, setForm] = useState<Partial<UpdateBookDto>>({
        title: book?.title || '',
        isbn: book?.isbn || '',
        pageCount: book?.pageCount || 0,
        publicationYear: book?.publicationYear || 0,
        language: book?.language || '',
        authorId: getInitialAuthorId(book),
        publisherId: book?.publisherId || 0,
        categoryId: book?.categoryId || 0,
        imageUrl: book?.imageUrl || DEFAULT_BOOK_IMAGE,
        summary: book?.summary || ''
    });

    const [authors, setAuthors] = useState<Author[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            Promise.all([
                authorService.getAllAuthors(),
                publisherService.getAllPublishers(),
                categoryService.getCategories()
            ]).then(([a, p, c]) => {
                if(Array.isArray(a)) setAuthors(a);
                if(Array.isArray(p)) setPublishers(p);
                if(Array.isArray(c)) setCategories(c);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (book) {
            const currentAuthorId = (book.bookAuthors && book.bookAuthors.length > 0)
                ? book.bookAuthors[0].authorId
                : book.authorId;

            setForm({
                id: book.id,
                title: book.title,
                isbn: book.isbn,
                pageCount: book.pageCount,
                publicationYear: book.publicationYear,
                language: book.language,
                authorId: currentAuthorId,
                publisherId: book.publisherId,
                categoryId: book.categoryId,
                imageUrl: book.imageUrl || DEFAULT_BOOK_IMAGE,
                summary: book.summary || ''
            });
        }
    }, [book]);

    if (!isOpen || !book) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'isbn') {
            if (value !== '' && !/^\d+$/.test(value)) return;
        }

        if (name === 'publicationYear') {
            if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) <= new Date().getFullYear())) {
                setForm(prev => ({ ...prev, publicationYear: value === '' ? undefined : parseInt(value, 10) }));
                return;
            } else {
                return;
            }
        }

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Güncelleniyor...");

        try {
            const finalImageUrl = (!form.imageUrl || form.imageUrl.trim() === '')
                ? DEFAULT_BOOK_IMAGE
                : form.imageUrl.trim();

            const dto: UpdateBookDto = {
                id: book.id,
                title: form.title!,
                isbn: form.isbn!,
                pageCount: Number(form.pageCount),
                publicationYear: Number(form.publicationYear),
                language: form.language!,
                authorId: Number(form.authorId),
                publisherId: Number(form.publisherId),
                categoryId: Number(form.categoryId),
                imageUrl: finalImageUrl,
                summary: form.summary!
            };

            await bookService.updateBook(book.id, dto);

            toast.success("Kitap güncellendi!", { id: toastId });
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Güncelleme hatası", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-stone-300 p-2 rounded text-sm text-black focus:outline-none focus:border-amber-500 bg-white";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl border border-stone-200 p-6 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                <h3 className="font-serif font-bold text-xl text-amber-950 mb-4 border-b border-stone-100 pb-2">Kitap Düzenle</h3>

                <div className="overflow-y-auto pr-2">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Kitap Adı</label>
                                <input type="text" name="title" value={form.title || ''} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">ISBN</label>
                                <input
                                    type="text"
                                    name="isbn"
                                    inputMode="numeric"
                                    maxLength={13}
                                    value={form.isbn || ''}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Sadece rakam"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Yazar</label>
                                <select name="authorId" value={form.authorId || ''} onChange={handleChange} className={inputClass}>
                                    <option value="">Seçiniz...</option>
                                    {authors.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Kategori</label>
                                <select name="categoryId" value={form.categoryId || ''} onChange={handleChange} className={inputClass}>
                                    <option value="">Seçiniz...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Yayınevi</label>
                                <select name="publisherId" value={form.publisherId || ''} onChange={handleChange} className={inputClass}>
                                    <option value="">Seçiniz...</option>
                                    {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Yıl</label>
                                <input
                                    type="number"
                                    name="publicationYear"
                                    value={form.publicationYear || ''}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Sayfa Sayısı</label>
                                <input type="number" name="pageCount" value={form.pageCount || ''} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Dil</label>
                                <select name="language" value={form.language || ''} onChange={handleChange} className={inputClass}>
                                    <option value="Türkçe">Türkçe</option>
                                    <option value="İngilizce">İngilizce</option>
                                    <option value="Almanca">Almanca</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Kapak Resmi URL</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={form.imageUrl || ''}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder={DEFAULT_BOOK_IMAGE}
                                />
                            </div>
                            <div className="w-16 h-24 bg-stone-100 border border-stone-200 rounded flex items-center justify-center overflow-hidden mt-1 shrink-0">
                                {form.imageUrl ? (
                                    <img
                                        src={form.imageUrl}
                                        alt="Önizleme"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target as HTMLImageElement).src = DEFAULT_BOOK_IMAGE}
                                    />
                                ) : (
                                    <span className="text-[10px] text-stone-400 text-center">Resim Yok</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-stone-600">Kitap Özeti</label>
                            </div>
                            <textarea
                                name="summary"
                                rows={4}
                                value={form.summary || ''}
                                onChange={handleChange}
                                className={`${inputClass} resize-y`}
                                placeholder="Kitap özeti..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 mt-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded text-sm font-medium transition-colors">İptal</button>
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-amber-900 text-white rounded text-sm font-medium hover:bg-amber-800 disabled:opacity-70 transition-colors">
                                {loading ? '...' : 'Güncelle'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}