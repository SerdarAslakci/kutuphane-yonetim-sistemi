'use client';

import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { roomService } from "@/src/services/roomService";
import { shelfService } from "@/src/services/shelfService";
import { bookCopyService } from "@/src/services/bookCopyService";
import { CreateCopyBookDto } from "@/src/types/book";
import { Room, Shelf } from '@/src/types/roomAndShelf';

interface AddCopyModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: { id: number; title: string } | null;
}

const AddBookCopyModal = ({ isOpen, onClose, book }: AddCopyModalProps) => {
    const [barcode, setBarcode] = useState("");
    const [roomId, setRoomId] = useState("");
    const [shelfId, setShelfId] = useState("");
    const [loading, setLoading] = useState(false);

    const [rooms, setRooms] = useState<Room[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);

    const [roomsLoading, setRoomsLoading] = useState(false);
    const [shelvesLoading, setShelvesLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        let mounted = true;
        setRoomsLoading(true);

        const loadRooms = async () => {
            try {
                const response = await roomService.getRooms();
                if (mounted) {
                    if (Array.isArray(response)) setRooms(response);
                    else setRooms([]);
                }
            } catch (err) {
                console.error("Odalar yüklenirken hata:", err);
                toast.error("Oda listesi alınamadı.");
            } finally {
                if (mounted) setRoomsLoading(false);
            }
        };

        loadRooms();

        return () => {
            mounted = false;
            setBarcode("");
            setRoomId("");
            setShelfId("");
            setShelves([]);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!roomId) {
            setShelves([]);
            setShelfId("");
            return;
        }

        const loadShelves = async () => {
            setShelvesLoading(true);
            try {
                const data = await shelfService.getShelvesByRoomId(parseInt(roomId));
                if (Array.isArray(data)) setShelves(data);
                else setShelves([]);
            } catch (error) {
                console.error("Raflar yüklenemedi", error);
                toast.error("Raf listesi yüklenemedi.");
            } finally {
                setShelvesLoading(false);
            }
        };

        loadShelves();
    }, [roomId]);

    if (!isOpen || !book) return null;

    const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^\d*$/.test(val)) {
            setBarcode(val);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading("İşlem gerçekleştiriliyor...");

        const parsedRoomId = parseInt(roomId);
        if (isNaN(parsedRoomId)) {
            toast.error("Lütfen geçerli bir oda seçiniz.", { id: toastId });
            setLoading(false);
            return;
        }

        const selectedShelf = shelves.find(s => s.id === parseInt(shelfId));
        if (!selectedShelf) {
            toast.error("Lütfen geçerli bir raf seçiniz.", { id: toastId });
            setLoading(false);
            return;
        }

        const createBookCopyDto: CreateCopyBookDto = {
            bookId: book.id,
            barcodeNumber: barcode,
            roomId: parsedRoomId,
            shelfCode: selectedShelf.shelfCode
        };

        try {
            await bookCopyService.createCopy(createBookCopyDto);

            toast.success("Kopya başarıyla eklendi!", { id: toastId });

            setBarcode("");
            setRoomId("");
            setShelfId("");
            onClose();

        } catch (error:any) {
            console.error("Kitap eklerken hata:", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-11/12 max-w-md border border-stone-200"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex justify-between items-center p-4 border-b border-stone-100 bg-stone-50 rounded-t-lg">
                    <h3 className="font-serif font-bold text-amber-950">Kopya Ekle</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 font-bold text-xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">

                    <div className="bg-amber-50 p-3 rounded border border-amber-100 text-sm mb-4">
                        <span className="font-bold text-amber-800 block mb-1">Seçilen Kitap:</span>
                        <div className="text-stone-800 font-medium">{book.title} <span className="text-stone-500 font-normal">(ID: {book.id})</span></div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Barkod Numarası <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            inputMode="numeric"
                            required
                            maxLength={50}
                            placeholder="Sadece rakam giriniz (Örn: 202400156)"
                            value={barcode}
                            onChange={handleBarcodeChange}
                            className="w-full border text-black rounded p-2 text-sm focus:border-amber-500 outline-none transition-all font-mono"
                        />
                        <p className="text-[10px] text-stone-400 mt-1">Sadece sayısal değerler kabul edilir.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Oda <span className="text-red-500">*</span></label>
                        <select
                            required
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            disabled={roomsLoading}
                            className="w-full border text-black rounded p-2 text-sm focus:border-amber-500 outline-none bg-white disabled:bg-stone-100"
                        >
                            <option value="">Oda Seçiniz...</option>
                            {roomsLoading ? (
                                <option disabled>Odalar yükleniyor...</option>
                            ) : (
                                rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.roomCode} {room.description ? `(${room.description})` : ''}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Raf <span className="text-red-500">*</span></label>
                        <select
                            required
                            value={shelfId}
                            onChange={(e) => setShelfId(e.target.value)}
                            disabled={!roomId || shelvesLoading}
                            className="w-full border text-black rounded p-2 text-sm focus:border-amber-500 outline-none bg-white disabled:bg-stone-100 disabled:text-gray-400"
                        >
                            <option value="">
                                {!roomId ? "Önce Oda Seçiniz" : "Raf Seçiniz..."}
                            </option>

                            {shelvesLoading ? (
                                <option disabled>Raflar yükleniyor...</option>
                            ) : (
                                shelves.map(shelf => (
                                    <option key={shelf.id} value={shelf.id}>
                                        {shelf.shelfCode}
                                    </option>
                                ))
                            )}
                        </select>
                        {shelves.length === 0 && roomId && !shelvesLoading && (
                            <p className="text-[10px] text-red-500 mt-1">Bu odada tanımlı raf yok.</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-stone-500 hover:text-stone-800 font-medium transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-2 rounded text-sm font-medium shadow-sm disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            {loading && <span className="animate-spin">↻</span>}
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookCopyModal;