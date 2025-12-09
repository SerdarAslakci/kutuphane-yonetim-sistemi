'use client';

import React, { useState, useEffect } from 'react';
import { roomService } from '@/src/services/roomService';
import { shelfService } from "@/src/services/shelfService";
import { Room, Shelf, CreateRoomDto, CreateShelfDto } from '@/src/types/roomAndShelf';

import RoomListPanel from '@/src/components/ui/Admin/Shelves/RoomListPanel';
import ShelfListPanel from '@/src/components/ui/Admin/Shelves/ShelfListPanel';
import AddRoomModal from '@/src/components/ui/Admin/Modals/AddRoomModal';
import AddShelfModal from '@/src/components/ui/Admin/Modals/AddShelfModal';
import UpdateShelfModal from '@/src/components/ui/Admin/Modals/UpdateShelfModal';
import UpdateRoomModal from '@/src/components/ui/Admin/Modals/UpdateRoomModal';
import toast from "react-hot-toast";

export default function AdminShelvesPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingShelves, setLoadingShelves] = useState(false);

    const [isUpdateRoomModalOpen, setIsUpdateRoomModalOpen] = useState(false);
    const [isUpdateShelfModalOpen, setIsUpdateShelfModalOpen] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
    const [shelfToEdit, setShelfToEdit] = useState<Shelf | null>(null);

    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            fetchShelves(selectedRoom.id);
        } else {
            setShelves([]);
        }
    }, [selectedRoom]);

    const fetchRooms = async () => {
        setLoadingRooms(true);
        try {
            const data = await roomService.getRooms();
            setRooms(data);
        } catch (error) {
            console.error("Odalar yüklenemedi", error);
        } finally {
            setLoadingRooms(false);
        }
    };

    const fetchShelves = async (roomId: number) => {
        setLoadingShelves(true);
        try {
            const data = await shelfService.getShelvesByRoomId(roomId);
            setShelves(data);
        } catch (error) {
            console.error("Raflar yüklenemedi", error);
        } finally {
            setLoadingShelves(false);
        }
    };

    const handleOpenEditRoom = (room: Room) => {
        setRoomToEdit(room);
        setIsUpdateRoomModalOpen(true);
    };

    const handleOpenEditShelf = (shelf: Shelf) => {
        setShelfToEdit(shelf);
        setIsUpdateShelfModalOpen(true);
    };

    const handleUpdateRoomSubmit = async (id: number, data: CreateRoomDto) => {
        const toastId = toast.loading("Oda güncelleniyor...");
        try{
            await roomService.updateRoom(id, data);
            setIsUpdateRoomModalOpen(false);

            toast.success("Oda başarıyla güncellendi.", { id: toastId });
            fetchRooms();
        }catch(error:any){
            console.error("Oda Guncellenemedi", error.response.data);
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

    const handleUpdateShelfSubmit = async (id: number, data: { roomId: number, shelfCode: string }) => {
        const toastId = toast.loading("Raf güncelleniyor...");
        try{
            await shelfService.updateShelf(id, data);
            setIsUpdateShelfModalOpen(false);

            toast.success("Raf başarıyla güncellendi.", { id: toastId });
            if (selectedRoom) fetchShelves(selectedRoom.id);
        }catch(error:any){
            console.error("Raf Guncellenemedi.", error.response.data);
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

    const handleRoomSubmit = async (data: CreateRoomDto) => {
        const toastId = toast.loading("Oda oluşturuluyor...");
        try{
            await roomService.createRoom(data);
            setIsRoomModalOpen(false);
            toast.success("Oda başarıyla eklendi.", { id: toastId });
            fetchRooms();
        }catch(error:any ){
            console.error("Room eklenemedi", error.response.data);
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

    const handleShelfSubmit = async (shelfCode: string) => {
        if (!selectedRoom) return;

        const toastId = toast.loading("Raf ekleniyor...");
        const dto: CreateShelfDto = {
            roomId: selectedRoom.id,
            shelfCode: shelfCode
        };
        try{
            await shelfService.createShelf(dto);
            setIsShelfModalOpen(false);
            toast.success("Raf başarıyla eklendi.", { id: toastId });
            fetchShelves(selectedRoom.id);
        }catch(error:any){
            console.error("Raf eklenemedi", error.response.data);
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

    return (
        <div className="space-y-6 md:h-[calc(100vh-140px)] flex flex-col pb-10 md:pb-0">

            <div>
                <h1 className="text-xl md:text-2xl font-bold text-stone-800 font-serif">Yerleşim Yönetimi</h1>
                <p className="text-stone-500 text-sm">Oda ve raf hiyerarşisini buradan yönetebilirsiniz.</p>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-12 gap-6 flex-1 min-h-0">

                <div className="md:col-span-4 h-64 md:h-full">
                    <RoomListPanel
                        rooms={rooms}
                        selectedRoom={selectedRoom}
                        loading={loadingRooms}
                        onSelectRoom={setSelectedRoom}
                        onAddClick={() => setIsRoomModalOpen(true)}
                        onEditClick={handleOpenEditRoom}
                    />
                </div>

                <div className="md:col-span-8 h-96 md:h-full">
                    <ShelfListPanel
                        shelves={shelves}
                        selectedRoom={selectedRoom}
                        loading={loadingShelves}
                        onAddClick={() => setIsShelfModalOpen(true)}
                        onEditClick={handleOpenEditShelf}
                    />
                </div>
            </div>

            <AddRoomModal
                isOpen={isRoomModalOpen}
                onClose={() => setIsRoomModalOpen(false)}
                onSubmit={handleRoomSubmit}
            />
            <AddShelfModal
                isOpen={isShelfModalOpen}
                onClose={() => setIsShelfModalOpen(false)}
                selectedRoom={selectedRoom}
                onSubmit={handleShelfSubmit}
            />
            <UpdateRoomModal
                isOpen={isUpdateRoomModalOpen}
                onClose={() => setIsUpdateRoomModalOpen(false)}
                room={roomToEdit}
                onSubmit={handleUpdateRoomSubmit}
            />
            <UpdateShelfModal
                isOpen={isUpdateShelfModalOpen}
                onClose={() => setIsUpdateShelfModalOpen(false)}
                shelf={shelfToEdit}
                currentRoomId={selectedRoom?.id || 0}
                onSubmit={handleUpdateShelfSubmit}
            />
        </div>
    );
}