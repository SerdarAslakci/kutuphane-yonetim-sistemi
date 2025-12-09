'use client';

import React from 'react';
import { Room, Shelf } from '@/src/types/roomAndShelf';

interface Props {
    shelves: Shelf[];
    selectedRoom: Room | null;
    loading: boolean;
    onAddClick: () => void;
    onEditClick: (shelf: Shelf) => void;
}

export default function ShelfListPanel({ shelves, selectedRoom, loading, onAddClick, onEditClick }: Props) {
    return (
        <div className="flex flex-col bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50 shrink-0">
                <h3 className="font-bold text-amber-950 text-sm md:text-base truncate pr-2">
                    {selectedRoom ? `${selectedRoom.roomCode} - Raflar` : 'Raflar'}
                </h3>
                <button
                    onClick={onAddClick}
                    disabled={!selectedRoom}
                    className="bg-stone-800 hover:bg-stone-900 text-stone-100 px-3 py-1 rounded text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    + Raf Ekle
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-stone-200">
                {!selectedRoom ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center p-4">
                        <span className="text-4xl mb-2">🗄️</span>
                        <p className="text-sm">Rafları görüntülemek için soldan bir oda seçiniz.</p>
                    </div>
                ) : (
                    <>
                        {loading && <p className="text-center text-stone-400">Raflar yükleniyor...</p>}

                        {!loading && shelves.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-stone-400">
                                <p>Bu odada henüz raf bulunmuyor.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                            {shelves.map(shelf => (
                                <div key={shelf.id} className="bg-stone-50 border border-stone-200 p-4 rounded flex flex-col items-center hover:shadow-md transition-shadow group relative min-h-[100px] justify-center">

                                    <button
                                        onClick={() => onEditClick(shelf)}
                                        className="absolute top-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100 text-stone-400 hover:text-amber-600 transition-opacity p-1"
                                        title="Rafı Düzenle"
                                    >
                                        ✏️
                                    </button>

                                    <span className="text-xl md:text-2xl mb-1 md:mb-2">📚</span>
                                    <span className="font-mono font-bold text-stone-800 text-base md:text-lg">{shelf.shelfCode}</span>
                                    <span className="text-[10px] text-stone-400 mt-0.5">ID: {shelf.id}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}