'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { publisherService } from '@/src/services/publisherService';
import { Publisher } from '@/src/types/publisherAndAuthor';

import AddPublisherModal from '@/src/components/ui/Admin/Modals/AddPublisherModal';
import UpdatePublisherModal from "@/src/components/ui/Admin/Modals/Update/UpdatePublisherModal";
import GenericDeleteModal from '@/src/components/ui/Admin/Modals/GenericDeleteModal';

import PaginationControls from '@/src/components/ui/Admin/Common/PaginationControls';

export default function AdminPublishersPage() {
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const fetchAllPublishers = async () => {
        setLoading(true);
        try {
            const result = await publisherService.getPublisherPageable(page,pageSize);

            if (result && Array.isArray(result.items)) {
                setPublishers(result.items);
                setTotalCount(result.totalCount || 0);
            } else if (Array.isArray(result)) {
                setPublishers(result);
                setTotalCount(result.length);
            } else {
                setPublishers([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("Yayınevleri yüklenemedi", error);
            toast.error("Liste yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const searchPublisher = async (name: string) => {
        setLoading(true);
        try {
            const result = await publisherService.getPublisherByName(name);
            if (Array.isArray(result)) {
                setPublishers(result);
                setTotalCount(result.length);
                setIsSearching(true);
            } else if (result) {
                setPublishers([result]);
                setTotalCount(1);
                setIsSearching(true);
            } else {
                setPublishers([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("Arama hatası", error);
            setPublishers([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() === "") {
            fetchAllPublishers();
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            searchPublisher(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleOpenUpdateModal = (publisher: Publisher) => { setSelectedPublisher(publisher); setIsUpdateModalOpen(true);};
    const handleOpenDeleteModal = (publisher: Publisher) => { setSelectedPublisher(publisher); setIsDeleteModalOpen(true);};
    const handleSuccess = () => { if(searchTerm) searchPublisher(searchTerm); else fetchAllPublishers();};

    const handleCloseModals = () => {
        setIsAddModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsUpdateModalOpen(false);
        setSelectedPublisher(null);
    };

    useEffect(() => {
        if (searchTerm.trim() === "") {
            fetchAllPublishers();
        }
    }, [page]);

    return (
        <div className="space-y-6 md:space-y-8 pb-10">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-stone-800 font-serif">Yayınevi Yönetimi</h1>
                    <p className="text-stone-500 text-sm">Sistemdeki yayınevlerini görüntüleyin ve yönetin.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <span>➕</span> Yeni Ekle
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                <div className="relative w-full md:w-1/3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Yayınevi adı ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-stone-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 placeholder-stone-400 transition-all"
                    />
                </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">
                <div className="md:hidden divide-y divide-stone-100">
                    {loading && <div className="p-8 text-center text-stone-500">Yükleniyor...</div>}
                    {!loading && publishers.length === 0 && <div className="p-8 text-center text-stone-500 italic">Kayıt bulunamadı.</div>}

                    {!loading && publishers.map((publisher) => (
                        <div key={publisher.id} className="p-4 flex justify-between items-center bg-white">
                            <div>
                                <div className="font-bold text-stone-800">{publisher.name}</div>
                                <div className="text-xs text-stone-400 font-mono">ID: #{publisher.id}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenUpdateModal(publisher)} className="text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 text-xs font-bold">Düzenle</button>
                                <button onClick={() => handleOpenDeleteModal(publisher)} className="text-red-700 bg-red-50 p-2 rounded border border-red-100 text-xs font-bold">Sil</button>
                            </div>
                        </div>
                    ))}
                </div>

                <table className="hidden md:table w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-xs border-b border-stone-200">
                    <tr>
                        <th className="px-6 py-3 w-20">ID</th>
                        <th className="px-6 py-3">Yayınevi Adı</th>
                        <th className="px-6 py-3 text-right">İşlemler</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                    {loading && <tr><td colSpan={3} className="p-8 text-center text-stone-500">Yükleniyor...</td></tr>}
                    {!loading && publishers.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-stone-500 italic">Kayıt bulunamadı.</td></tr>}

                    {!loading && publishers.map((publisher) => (
                        <tr key={publisher.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-stone-400">#{publisher.id}</td>
                            <td className="px-6 py-4 font-bold text-stone-800">{publisher.name}</td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => handleOpenUpdateModal(publisher)} className="text-stone-400 hover:text-amber-700 transition-colors font-medium">Düzenle</button>
                                <button onClick={() => handleOpenDeleteModal(publisher)} className="text-stone-400 hover:text-red-700 transition-colors font-medium">Sil</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {!loading && !isSearching && searchTerm === "" && totalCount > 0 && (
                <div className="overflow-x-auto">
                    <PaginationControls
                        currentPage={page}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <AddPublisherModal isOpen={isAddModalOpen} onClose={handleCloseModals} onSuccess={handleSuccess} />
            <UpdatePublisherModal isOpen={isUpdateModalOpen} onClose={handleCloseModals} publisher={selectedPublisher} onSuccess={handleSuccess} />
            <GenericDeleteModal isOpen={isDeleteModalOpen} onClose={handleCloseModals} entityId={selectedPublisher?.id || 0} entityName={selectedPublisher?.name || ''} entityType="Yayınevi" onDeleteService={publisherService.deletePublisher} onSuccess={handleSuccess} />
        </div>
    );
}