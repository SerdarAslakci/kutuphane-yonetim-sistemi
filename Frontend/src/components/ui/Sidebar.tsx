'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categoryService } from '@/src/services/categoryService';
import { authorService } from '@/src/services/authorService';
import { publisherService } from '@/src/services/publisherService';
import { Category } from '@/src/types/category';
import { Author, Publisher } from '@/src/types/publisherAndAuthor';

export default function Sidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // --- DATA STATE ---
    const [categories, setCategories] = useState<Category[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);

    // --- FILTER STATE ---
    const [filters, setFilters] = useState({
        categoryId: searchParams.get('categoryId') || '',
        authorId: searchParams.get('authorId') || '',
        publisherId: searchParams.get('publisherId') || '',
        yearMin: searchParams.get('yearMin') || '',
        yearMax: searchParams.get('yearMax') || '',
        pageMin: searchParams.get('pageCountMin') || '',
        pageMax: searchParams.get('pageCountMax') || '',
        language: searchParams.get('language') || '',
        hasAvailableCopy: searchParams.get('hasAvailableCopy') === 'true'
    });

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [cats, auths, pubs] = await Promise.all([
                    categoryService.getCategories(),
                    authorService.getAllAuthors(),
                    publisherService.getAllPublishers()
                ]);

                if (Array.isArray(cats)) setCategories(cats);
                if (Array.isArray(auths)) setAuthors(auths);
                if (Array.isArray(pubs)) setPublishers(pubs);
            } catch (error) {
                console.error("Filtre verileri yüklenemedi", error);
            }
        };
        fetchFilters();
    }, []);

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFilters(prev => ({ ...prev, [name]: checked }));
            return;
        }

        // --- SAYISAL GİRİŞ KONTROLLERİ ---

        // 1. Yayın Yılı Kontrolü (Min/Max Year)
        if (name === 'yearMin' || name === 'yearMax') {
            // Sadece sayı girilmesine izin ver
            if (value && !/^\d+$/.test(value)) return;
            // 4 karakterden fazla olamaz
            if (value.length > 4) return;
        }

        // 2. Sayfa Sayısı Kontrolü (Min/Max Page)
        if (name === 'pageMin' || name === 'pageMax') {
            // Sadece sayı girilmesine izin ver
            if (value && !/^\d+$/.test(value)) return;
            // Aşırı uzun sayı girişini engelle (örn: 6 hane)
            if (value.length > 6) return;
        }

        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (filters.categoryId) params.set('categoryId', filters.categoryId); else params.delete('categoryId');
        if (filters.authorId) params.set('authorId', filters.authorId); else params.delete('authorId');
        if (filters.publisherId) params.set('publisherId', filters.publisherId); else params.delete('publisherId');

        if (filters.yearMin) params.set('yearMin', filters.yearMin); else params.delete('yearMin');
        if (filters.yearMax) params.set('yearMax', filters.yearMax); else params.delete('yearMax');

        if (filters.pageMin) params.set('pageCountMin', filters.pageMin); else params.delete('pageCountMin');
        if (filters.pageMax) params.set('pageCountMax', filters.pageMax); else params.delete('pageCountMax');

        if (filters.language) params.set('language', filters.language); else params.delete('language');

        if (filters.hasAvailableCopy) params.set('hasAvailableCopy', 'true'); else params.delete('hasAvailableCopy');

        params.set('page', '1');
        router.push(`/?${params.toString()}`);
    };

    const clearFilters = () => {
        setFilters({
            categoryId: '', authorId: '', publisherId: '',
            yearMin: '', yearMax: '', pageMin: '', pageMax: '',
            language: '', hasAvailableCopy: false
        });
        router.push('/');
    };

    return (
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-amber-950">Filtreler</h3>
                <button onClick={clearFilters} className="text-xs text-stone-500 hover:text-red-600 underline">Temizle</button>
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Kategori</label>
                <select
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-md p-2 text-sm text-black focus:border-amber-500 outline-none bg-white"
                >
                    <option value="">Tümü</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Yazar</label>
                <select
                    name="authorId"
                    value={filters.authorId}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-md p-2 text-sm text-black focus:border-amber-500 outline-none bg-white"
                >
                    <option value="">Tümü</option>
                    {authors.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Yayınevi</label>
                <select
                    name="publisherId"
                    value={filters.publisherId}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-md p-2 text-sm text-black focus:border-amber-500 outline-none bg-white"
                >
                    <option value="">Tümü</option>
                    {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Dil</label>
                <select
                    name="language"
                    value={filters.language}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-md p-2 text-sm text-black focus:border-amber-500 outline-none bg-white"
                >
                    <option value="">Tümü</option>
                    <option value="Türkçe">Türkçe</option>
                    <option value="İngilizce">İngilizce</option>
                    <option value="Almanca">Almanca</option>
                    <option value="Fransızca">Fransızca</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Yayın Yılı</label>
                <div className="flex gap-2">
                    <input
                        type="text" // number yerine text kullanıyoruz ki regex ile tam kontrol edelim
                        inputMode="numeric"
                        name="yearMin"
                        placeholder="Min"
                        value={filters.yearMin}
                        onChange={handleInputChange}
                        className="w-full border border-stone-300 rounded-md p-2 text-sm text-black focus:border-amber-500 outline-none"
                    />
                    <input
                        type="text"
                        inputMode="numeric"
                        name="yearMax"
                        placeholder="Max"
                        value={filters.yearMax}
                        onChange={handleInputChange}
                        className="w-full border border-stone-300 rounded-md p-2 text-sm text-black focus:border-amber-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Sayfa Sayısı</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        name="pageMin"
                        placeholder="Min"
                        value={filters.pageMin}
                        onChange={handleInputChange}
                        className="w-full border border-stone-300 rounded-md p-2 text-sm text-black focus:border-amber-500 outline-none"
                    />
                    <input
                        type="text"
                        inputMode="numeric"
                        name="pageMax"
                        placeholder="Max"
                        value={filters.pageMax}
                        onChange={handleInputChange}
                        className="w-full border border-stone-300 rounded-md p-2 text-sm text-black focus:border-amber-500 outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <input
                    type="checkbox"
                    id="hasCopy"
                    name="hasAvailableCopy"
                    checked={filters.hasAvailableCopy}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                />
                <label htmlFor="hasCopy" className="text-sm text-stone-700 cursor-pointer select-none">
                    Sadece Müsait Olanlar
                </label>
            </div>

            <button
                onClick={applyFilters}
                className="w-full bg-amber-900 hover:bg-amber-800 text-white font-bold py-2.5 rounded-lg shadow-md transition-all active:scale-95"
            >
                Filtrele
            </button>
        </div>
    );
}