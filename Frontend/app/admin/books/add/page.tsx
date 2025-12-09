'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { roomService } from '@/src/services/roomService';
import { shelfService } from '@/src/services/shelfService';
import { bookService } from '@/src/services/bookService';
import { authorService } from '@/src/services/authorService';
import { publisherService } from '@/src/services/publisherService';
import { categoryService } from '@/src/services/categoryService';
import { bookCopyService } from "@/src/services/bookCopyService";
import { Room, Shelf } from '@/src/types/roomAndShelf';
import { Author, Publisher } from '@/src/types/publisherAndAuthor';
import { Category } from "@/src/types/category";

import AddPublisherModal from "@/src/components/ui/Admin/Modals/AddPublisherModal";
import AddAuthorModal from "@/src/components/ui/Admin/Modals/AddAuthorModal";
import { CreateBookDto, CreateCopyBookDto } from "@/src/types/book";
import AddCategoryModal from "@/src/components/ui/Admin/Modals/AddCategoryModal";

interface CreateBookFormState {
    title: string;
    isbn: string;
    authorId: string;
    publisherId: string;
    categoryId: string;
    publicationYear: string;
    pageCount: string;
    language: string;
    imageUrl: string;
    summary: string;

    addCopy: boolean;
    roomId: string;
    barcodeNumber: string;
    shelfId: string;
}
interface FormErrors {
    [key: string]: string;
}
const DEFAULT_BOOK_IMAGE = "https://i.ibb.co/F47gc8Xk/unnamed.jpg";

export default function AddBookPage() {
    const router = useRouter();

    const [form, setForm] = useState<CreateBookFormState>({
        title: '', isbn: '', authorId: '', publisherId: '', categoryId: '',
        publicationYear: '', pageCount: '', language: 'Türkçe',
        imageUrl: DEFAULT_BOOK_IMAGE, summary: '',
        addCopy: false, barcodeNumber: '',
        roomId: '', shelfId: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const [rooms, setRooms] = useState<Room[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingShelves, setLoadingShelves] = useState(false);
    const [submitting, setSubmitting] = useState(false);


    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [isCategoryAddModelOpen, setIsCategoryAddModalOpen] = useState(false);
    const [isPublisherModalOpen, setIsPublisherModalOpen] = useState(false);

    const fetchAuthors = async () => {
        try {
            const data = await authorService.getAllAuthors();
            if (Array.isArray(data)) setAuthors(data);
        } catch (e) { console.error(e); }
    };

    const fetchPublishers = async () => {
        try {
            const data = await publisherService.getAllPublishers();
            if (Array.isArray(data)) setPublishers(data);
        } catch (e) { console.error(e); }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            if (Array.isArray(data)) setCategories(data);
        } catch (e) { console.error(e); }
    }

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [roomsData, authorsData, publishersData, categoriesData] = await Promise.all([
                    roomService.getRooms(),
                    authorService.getAllAuthors(),
                    publisherService.getAllPublishers(),
                    categoryService.getCategories()
                ]);

                if (Array.isArray(roomsData)) setRooms(roomsData);
                if (Array.isArray(authorsData)) setAuthors(authorsData);
                if (Array.isArray(publishersData)) setPublishers(publishersData);
                if (Array.isArray(categoriesData)) setCategories(categoriesData);

            } catch (error) {
                console.error("Veri yükleme hatası", error);
                toast.error("Form verileri yüklenirken hata oluştu.");
            } finally {
                setLoadingInitial(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!form.roomId) {
            setShelves([]);
            return;
        }

        const fetchShelves = async () => {
            setLoadingShelves(true);
            setShelves([]);
            try {
                const data = await shelfService.getShelvesByRoomId(parseInt(form.roomId));
                if (Array.isArray(data)) setShelves(data);
            } catch (error) {
                toast.error("Raf listesi yüklenemedi.");
            } finally {
                setLoadingShelves(false);
            }
        };

        fetchShelves();
    }, [form.roomId]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const currentYear = new Date().getFullYear();

        if (!form.title.trim()) newErrors.title = "Kitap adı zorunludur.";
        if (!form.isbn.trim()) newErrors.isbn = "ISBN zorunludur.";
        if (!form.authorId) newErrors.authorId = "Yazar seçimi zorunludur.";
        if (!form.publisherId) newErrors.publisherId = "Yayınevi seçimi zorunludur.";
        if (!form.categoryId) newErrors.categoryId = "Kategori seçimi zorunludur.";

        const year = parseInt(form.publicationYear);
        if (!form.publicationYear) {
            newErrors.publicationYear = "Yayın yılı zorunludur.";
        } else if (isNaN(year) || year < 0) {
            newErrors.publicationYear = "Geçerli bir yıl giriniz (Negatif olamaz).";
        } else if (year > currentYear + 1) {
            newErrors.publicationYear = "Gelecekten bir yıl giremezsiniz.";
        }

        const pages = parseInt(form.pageCount);
        if (!form.pageCount) {
            newErrors.pageCount = "Sayfa sayısı zorunludur.";
        } else if (isNaN(pages) || pages <= 0) {
            newErrors.pageCount = "Sayfa sayısı 0'dan büyük olmalıdır.";
        }

        if (form.addCopy) {
            if (!form.roomId) newErrors.roomId = "Oda seçimi zorunludur.";
            if (!form.shelfId) newErrors.shelfId = "Raf seçimi zorunludur.";
            if (!form.barcodeNumber.trim()) newErrors.barcodeNumber = "Barkod zorunludur.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'addCopy' && 'checked' in e.target) {
            const checked = (e.target as HTMLInputElement).checked;
            setForm(prev => ({ ...prev, [name]: checked }));

            if (!checked) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.roomId;
                    delete newErrors.shelfId;
                    delete newErrors.barcodeNumber;
                    return newErrors;
                });
            }
            return;
        }

        if (name === 'isbn' || name === 'barcodeNumber') {
            if (value !== '' && !/^\d+$/.test(value)) return;
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (name === 'roomId') {
            setForm(prev => ({ ...prev, [name]: value, shelfId: '' }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Lütfen formdaki hataları düzeltiniz.");
            return;
        }

        setSubmitting(true);
        const toastId = toast.loading("Kitap kaydediliyor...");

        try {
            const finalImageUrl = form.imageUrl.trim() === '' ? DEFAULT_BOOK_IMAGE : form.imageUrl.trim();

            const dto: CreateBookDto = {
                ...form,
                title: form.title.trim(),
                isbn: form.isbn.trim(),
                pageCount: parseInt(form.pageCount),
                publicationYear: parseInt(form.publicationYear),
                language: form.language,
                authorId: parseInt(form.authorId),
                categoryId: parseInt(form.categoryId),
                publisherId: parseInt(form.publisherId),
                imageUrl: finalImageUrl,
                summary: form.summary.trim()
            };
            const response = await bookService.createBook(dto);
            if (form.addCopy && response?.id) {
                const copyDto: CreateCopyBookDto = {
                    bookId: response.id,
                    roomId: parseInt(form.roomId),
                    shelfCode: form.shelfId,
                    barcodeNumber: form.barcodeNumber
                };

                const bookCopyResponse = await bookCopyService.createCopy(copyDto);
                if (!bookCopyResponse?.id) {
                    throw new Error("Kopya eklenemedi.");
                }
                toast.success("Kitap ve kopya başarıyla eklendi!", { id: toastId });
            } else {
                toast.success("Kitap başarıyla eklendi (Kopyasız)!", { id: toastId });
            }

            await new Promise(r => setTimeout(r, 1000));
            router.push('/admin/books');
        } catch (error: any) {
            console.error("Kitap eklenemedi", error.response.data);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getInputClass = (fieldName: string) => `
        w-full border rounded-md p-2.5 outline-none transition-all text-black
        ${errors[fieldName]
        ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50'
        : 'border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'}
    `;

    return (
        <div className="max-w-4xl mx-auto pb-10 px-4 md:px-0">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-stone-500 hover:text-amber-800 text-sm mb-2 flex items-center gap-1 transition-colors"
                >
                    ← Listeye Dön
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-stone-800 font-serif">Yeni Kitap Kaydı</h1>
                <p className="text-stone-500 text-sm">Kütüphane envanterine yeni bir kitap ekleyin.</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-4 md:p-8 relative"> {/* Mobilde padding azaltıldı */}

                {loadingInitial && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                        <span className="text-amber-800 font-medium">Veriler yükleniyor...</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Kitap Adı <span className="text-red-500">*</span></label>
                            <input name="title" type="text" value={form.title} onChange={handleChange} className={getInputClass('title')} placeholder="Örn: Nutuk" />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">ISBN <span className="text-red-500">*</span></label>
                            <input name="isbn" type="text" inputMode="numeric" value={form.isbn} onChange={handleChange} className={getInputClass('isbn')} placeholder="Sadece rakam (Örn: 978123...)" maxLength={13} />
                            {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Yazar <span className="text-red-500">*</span></label>
                            <select name="authorId" value={form.authorId} onChange={handleChange} className={`${getInputClass('authorId')} bg-white`}>
                                <option value="">Yazar Seçiniz...</option>
                                {authors.map(author => (<option key={author.id} value={author.id}>{author.firstName} {author.lastName}</option>))}
                            </select>
                            {errors.authorId && <p className="text-red-500 text-xs mt-1">{errors.authorId}</p>}
                            <div onClick={() => setIsAuthorModalOpen(true)} className="mt-1 text-xs text-amber-700 cursor-pointer hover:underline font-medium inline-block">+ Yeni Yazar Ekle</div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Yayınevi <span className="text-red-500">*</span></label>
                            <select name="publisherId" value={form.publisherId} onChange={handleChange} className={`${getInputClass('publisherId')} bg-white`}>
                                <option value="">Yayınevi Seçiniz...</option>
                                {publishers.map(pub => (<option key={pub.id} value={pub.id}>{pub.name}</option>))}
                            </select>
                            {errors.publisherId && <p className="text-red-500 text-xs mt-1">{errors.publisherId}</p>}
                            <div onClick={() => setIsPublisherModalOpen(true)} className="mt-1 text-xs text-amber-700 cursor-pointer hover:underline font-medium inline-block">+ Yeni Yayınevi Ekle</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Kategori <span className="text-red-500">*</span></label>
                            <select name="categoryId" value={form.categoryId} onChange={handleChange} className={getInputClass('categoryId')}>
                                <option value="">Seçiniz...</option>
                                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                            </select>
                            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
                            <div onClick={() => setIsCategoryAddModalOpen(true)} className="mt-1 text-xs text-amber-700 cursor-pointer hover:underline font-medium inline-block">+ Yeni Ekle</div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Yayın Yılı</label>
                            <input name="publicationYear" type="number" value={form.publicationYear} onChange={handleChange} min="0" className={getInputClass('publicationYear')} placeholder="2024" />
                            {errors.publicationYear && <p className="text-red-500 text-xs mt-1">{errors.publicationYear}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Sayfa</label>
                            <input name="pageCount" type="number" value={form.pageCount} onChange={handleChange} min="1" className={getInputClass('pageCount')} placeholder="350" />
                            {errors.pageCount && <p className="text-red-500 text-xs mt-1">{errors.pageCount}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Dil</label>
                            <select name="language" value={form.language} onChange={handleChange} className={`${getInputClass('language')} bg-white`}>
                                <option value="Türkçe">Türkçe</option>
                                <option value="İngilizce">İngilizce</option>
                                <option value="Almanca">Almanca</option>
                                <option value="Fransızca">Fransızca</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-6 items-start">
                        <div className="w-full">
                            <label className="block text-sm font-bold text-stone-700 mb-2">Kapak Resmi URL</label>
                            <input
                                name="imageUrl"
                                type="text"
                                value={form.imageUrl}
                                onChange={handleChange}
                                className={getInputClass('imageUrl')}
                                placeholder={DEFAULT_BOOK_IMAGE}
                            />
                            <p className="text-xs text-stone-400 mt-1">Görselin doğrudan bağlantısını (URL) yapıştırınız.</p>
                        </div>

                        <div className="w-24 h-36 bg-stone-100 border border-stone-200 rounded-md flex items-center justify-center overflow-hidden shrink-0 mt-1 mx-auto md:mx-0">
                            {form.imageUrl ? (
                                <img
                                    src={form.imageUrl}
                                    alt="Önizleme"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_BOOK_IMAGE; }}
                                />
                            ) : (
                                <span className="text-stone-400 text-xs text-center px-1">Görsel Yok</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-stone-700">Kitap Özeti</label>
                        </div>
                        <textarea
                            name="summary"
                            value={form.summary}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Kitap hakkında bir özet giriniz..."
                            className="w-full border border-stone-300 rounded-md p-3 text-sm text-black focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-y"
                        />
                    </div>

                    <div className={`border rounded-md transition-colors duration-200 ${form.addCopy ? 'border-amber-200 bg-amber-50/30' : 'border-stone-200 bg-stone-50'}`}>
                        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <h3 className="font-bold text-amber-950 text-sm">Konum ve Kopya Bilgisi</h3>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" name="addCopy" checked={form.addCopy} onChange={handleChange} className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500" />
                                <span className="text-sm text-stone-700 font-medium">İlk kopyayı şimdi ekle</span>
                            </label>
                        </div>

                        {form.addCopy && (
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-xs font-bold text-stone-600 mb-1">Barkod No <span className="text-red-500">*</span></label>
                                    <input name="barcodeNumber" type="text" inputMode="numeric" value={form.barcodeNumber} onChange={handleChange} className={getInputClass('barcodeNumber')} placeholder="Sadece rakam giriniz" />
                                    {errors.barcodeNumber && <p className="text-red-500 text-xs mt-1">{errors.barcodeNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-600 mb-1">Oda <span className="text-red-500">*</span></label>
                                    <select name="roomId" value={form.roomId} onChange={handleChange} className={getInputClass('roomId')}>
                                        <option value="">Oda Seçiniz...</option>
                                        {rooms.map(r => <option key={r.id} value={r.id}>{r.roomCode} ({r.description})</option>)}
                                    </select>
                                    {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-600 mb-1">Raf <span className="text-red-500">*</span></label>
                                    <select name="shelfId" value={form.shelfId} onChange={handleChange} disabled={!form.roomId || loadingShelves} className={`${getInputClass('shelfId')} disabled:bg-gray-100`}>
                                        <option value="">{!form.roomId ? "Önce Oda Seç" : "Raf Seç..."}</option>
                                        {shelves.map(s => <option key={s.id} value={s.id}>{s.shelfCode}</option>)}
                                    </select>
                                    {errors.shelfId && <p className="text-red-500 text-xs mt-1">{errors.shelfId}</p>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4 border-t border-stone-100">
                        <button type="button" onClick={() => router.back()} className="text-stone-500 hover:text-stone-800 font-medium text-sm transition-colors">İptal</button>
                        <button type="submit" disabled={submitting || loadingInitial} className="bg-amber-900 hover:bg-amber-800 text-white px-8 py-2.5 rounded-md font-serif font-medium shadow-md transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                            {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>

                </form>
            </div>

            <AddAuthorModal isOpen={isAuthorModalOpen} onClose={() => setIsAuthorModalOpen(false)} onSuccess={fetchAuthors} />
            <AddCategoryModal isOpen={isCategoryAddModelOpen} onClose={() => setIsCategoryAddModalOpen(false)} onSuccess={fetchCategories} />
            <AddPublisherModal isOpen={isPublisherModalOpen} onClose={() => setIsPublisherModalOpen(false)} onSuccess={fetchPublishers} />
        </div>
    );
}