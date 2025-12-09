'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BookCopy } from '@/src/types/bookDetail';
import { Room, Shelf } from '@/src/types/roomAndShelf';
import { Book } from "@/src/types/book";
import { roomService } from '@/src/services/roomService';
import { shelfService } from '@/src/services/shelfService';
import { bookCopyService } from '@/src/services/bookCopyService';

interface ManageCopiesProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onUpdate: () => void;
}

export default function ManageBookCopiesModal({ isOpen, onClose, book, onUpdate }: ManageCopiesProps) {
    const [copies, setCopies] = useState<BookCopy[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [availableShelves, setAvailableShelves] = useState<Shelf[]>([]);

    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ roomId: 0, shelfCode: '', barcodeNumber: '' });

    useEffect(() => {
        if (isOpen && book) {
            setPage(1);
            fetchInitialData();
        }
    }, [isOpen, book]);

    useEffect(() => {
        if (isOpen && book) {
            fetchCopies(page);
        }
    }, [page]);

    useEffect(() => {
        if (editingId && editForm.roomId > 0) {
            fetchShelvesForEdit(editForm.roomId);
        }
    }, [editForm.roomId, editingId]);


    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const roomData = await roomService.getRooms();
            if(Array.isArray(roomData)) setRooms(roomData);
            await fetchCopies(1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCopies = async (pageNum: number) => {
        if (!book) return;
        try {
            const result = await bookCopyService.getCopiesByBookId(book.id, pageNum, pageSize);
            setCopies(result.items || []);
            setTotalCount(result.totalCount || 0);
        } catch (error:any) {
            const toastId = toast.error("Kopyalar yüklenemedi.");
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
        }
    };

    const fetchShelvesForEdit = async (roomId: number) => {
        try {
            const shelves = await shelfService.getShelvesByRoomId(roomId);
            if(Array.isArray(shelves)) setAvailableShelves(shelves);
        } catch (error) {
            console.error("Raflar yüklenemedi");
        }
    };

    const handleEditClick = (copy: BookCopy) => {
        setEditingId(copy.id);
        setEditForm({
            roomId: copy.shelf?.roomId || 0,
            shelfCode: copy.shelf?.shelfCode || '',
            barcodeNumber: copy.barcodeNumber || ''
        });
        if(copy.shelf?.roomId) fetchShelvesForEdit(copy.shelf.roomId);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ roomId: 0, shelfCode: '' ,barcodeNumber: ''});
    };

    const handleSave = async (copyId: number) => {
        const toastId = toast.loading("Kopya güncelleniyor...");
        if (editForm.roomId === 0 || !editForm.shelfCode || !editForm.barcodeNumber) {
            return toast.error("Lütfen oda ve raf veya barkod numarasini duzgun seçiniz.", { id: toastId });
        }

        try {
            await bookCopyService.updateCopy({
                id: copyId,
                roomId: editForm.roomId,
                shelfCode: editForm.shelfCode,
                barcodeNumber: editForm.barcodeNumber,
                isAvailable: true
            });

            toast.success("Kopya güncellendi.", { id: toastId });
            setEditingId(null);
            fetchCopies(page);
            onUpdate();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
        }
    };

    const handleDelete = async (copyId: number) => {
        const toastId = toast.loading("Kopya siliniyor...");
        if (!confirm("Bu kopya kalıcı olarak silinecek. Emin misiniz?")) return;
        try {
            await bookCopyService.deleteCopy(copyId);
            toast.success("Kopya silindi.", { id: toastId });
            if (copies.length === 1 && page > 1) {
                setPage(p => p - 1);
            } else {
                fetchCopies(page);
            }
            onUpdate();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
        }
    };

    const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^\d*$/.test(val)) {
            setEditForm({ ...editForm, barcodeNumber: val });
        }
    };

    const renderEditForm = () => (
        <div className="flex flex-col gap-2 p-2 bg-amber-50 rounded border border-amber-200">
            <input
                type="text"
                value={editForm.barcodeNumber}
                onChange={handleBarcodeChange}
                className="border border-amber-300 rounded p-1.5 text-xs w-full outline-none focus:ring-1 focus:ring-amber-500 text-black font-mono"
                maxLength={13}
                placeholder="Barkod"
            />
            <div className="flex gap-2">
                <select
                    className="border border-amber-300 rounded p-1.5 text-xs text-black w-1/2 outline-none focus:ring-1 focus:ring-amber-500"
                    value={editForm.roomId}
                    onChange={(e) => setEditForm({ ...editForm, roomId: Number(e.target.value), shelfCode: '' })}
                >
                    <option value={0}>Oda Seç</option>
                    {rooms.map(r => (
                        <option key={r.id} value={r.id}>{r.roomCode}</option>
                    ))}
                </select>
                <select
                    className="border border-amber-300 rounded p-1.5 text-xs text-black w-1/2 outline-none focus:ring-1 focus:ring-amber-500"
                    value={editForm.shelfCode}
                    onChange={(e) => setEditForm({ ...editForm, shelfCode: e.target.value })}
                    disabled={editForm.roomId === 0}
                >
                    <option value="">Raf Seç</option>
                    {availableShelves.map(s => (
                        <option key={s.id} value={s.shelfCode}>{s.shelfCode}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2 mt-1">
                <button
                    // @ts-ignore
                    onClick={() => handleSave(editingId)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs w-1/2"
                >
                    Kaydet
                </button>
                <button onClick={handleCancelEdit} className="bg-stone-300 text-stone-700 px-3 py-1 rounded text-xs w-1/2">İptal</button>
            </div>
        </div>
    );

    if (!isOpen || !book) return null;

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl border border-stone-200 flex flex-col max-h-[90vh]">

                <div className="flex justify-between items-center p-4 border-b border-stone-100 bg-stone-50 rounded-t-lg shrink-0">
                    <div>
                        <h3 className="font-serif font-bold text-amber-950">Kopyaları Yönet</h3>
                        <p className="text-xs text-stone-500">{book.title} (Toplam: {totalCount})</p>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 font-bold px-2 text-xl">&times;</button>
                </div>

                <div className="p-0 overflow-y-auto flex-1 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                            <span className="text-amber-800 font-bold">Yükleniyor...</span>
                        </div>
                    )}

                    <table className="hidden md:table w-full text-sm text-left">
                        <thead className="bg-stone-50 text-stone-500 uppercase text-xs sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-3">Barkod</th>
                            <th className="px-6 py-3">Oda</th>
                            <th className="px-6 py-3">Raf</th>
                            <th className="px-6 py-3">Durum</th>
                            <th className="px-6 py-3 text-right">İşlemler</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                        {copies.map((copy) => {
                            const isEditing = editingId === copy.id;
                            if (isEditing) {
                                return (
                                    <tr key={copy.id}>
                                        <td colSpan={5} className="p-4">
                                            {renderEditForm()}
                                        </td>
                                    </tr>
                                )
                            }
                            return (
                                <tr key={copy.id} className="hover:bg-amber-50/20">
                                    <td className="px-6 py-4 font-mono text-stone-600 font-medium">{copy.barcodeNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-stone-800">{copy.shelf?.room?.roomCode}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-xs">{copy.shelf?.shelfCode}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {copy.isAvailable
                                            ? <span className="text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs border border-green-200 font-bold">Müsait</span>
                                            : <span className="text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs border border-red-200 font-bold">Ödünçte</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEditClick(copy)} className="text-amber-700 hover:text-amber-900 text-xs font-medium hover:underline">Düzenle</button>
                                            <button onClick={() => handleDelete(copy.id)} className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline">Sil</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    <div className="md:hidden divide-y divide-stone-100">
                        {copies.map((copy) => {
                            const isEditing = editingId === copy.id;
                            if (isEditing) {
                                return <div key={copy.id} className="p-4">{renderEditForm()}</div>
                            }
                            return (
                                <div key={copy.id} className="p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono font-bold text-stone-800 text-sm">{copy.barcodeNumber}</span>
                                        {copy.isAvailable
                                            ? <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded text-[10px] border border-green-200 font-bold">Müsait</span>
                                            : <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded text-[10px] border border-red-200 font-bold">Ödünçte</span>
                                        }
                                    </div>
                                    <div className="text-xs text-stone-600 grid grid-cols-2 gap-2">
                                        <div><span className="font-bold text-stone-400">Oda:</span> {copy.shelf?.room?.roomCode}</div>
                                        <div><span className="font-bold text-stone-400">Raf:</span> {copy.shelf?.shelfCode}</div>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-2 border-t border-stone-50 pt-2">
                                        <button onClick={() => handleEditClick(copy)} className="text-amber-700 text-xs font-bold border border-amber-200 px-3 py-1 rounded bg-amber-50">Düzenle</button>
                                        <button onClick={() => handleDelete(copy.id)} className="text-red-600 text-xs font-bold border border-red-200 px-3 py-1 rounded bg-red-50">Sil</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {copies.length === 0 && !loading && (
                        <div className="text-center py-8 text-stone-500 text-sm">
                            Bu kitaba ait kayıtlı kopya bulunamadı.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-stone-100 bg-stone-50 rounded-b-lg flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-3 py-1 bg-white border border-stone-300 rounded text-xs disabled:opacity-50 hover:bg-stone-100 text-stone-700 transition-colors"
                        >
                            ←
                        </button>
                        <span className="text-xs text-stone-600 font-medium bg-white px-3 py-1 border rounded shadow-sm">
                            {page} / {totalPages || 1}
                        </span>
                        <button
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 bg-white border border-stone-300 rounded text-xs disabled:opacity-50 hover:bg-stone-100 text-stone-700 transition-colors"
                        >
                            →
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-sm font-bold transition-colors"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}