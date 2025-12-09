import {CreateShelfDto, Shelf, UpdateShelfDto} from "@/src/types/roomAndShelf";
import axiosInstance from "@/src/utils/axiosInstance";

const API_SHELF_BASE = "/api/shelf";

export const shelfService = {
    getShelvesByRoomId: async (roomId: number): Promise<Shelf[]> => {
        const response = await axiosInstance.get(`${API_SHELF_BASE}/list?roomId=${roomId}`,{
            baseURL: ''
        });
        return response.data;
    },

    createShelf: async (dto: CreateShelfDto): Promise<Shelf> => {
        const response = await axiosInstance.post(`${API_SHELF_BASE}/create`, dto,{
            baseURL: ''
        });
        return response.data;
    },

    updateShelf: async (id: number, dto: UpdateShelfDto): Promise<void> => {
        await axiosInstance.put(`${API_SHELF_BASE}/update?id=${id}`, dto, {
            baseURL: ''
        });
    }
}