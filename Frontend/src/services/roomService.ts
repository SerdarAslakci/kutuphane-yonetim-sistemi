import {BookCopy} from '@/src/types/bookDetail';
import { PaginatedResult, CopyFilterDto} from "@/src/types/book";
import axiosInstance from '@/src/utils/axiosInstance';
import {CreateRoomDto, Room} from "@/src/types/roomAndShelf";

const API_ROUTE_BASE = "/api/room";

export const roomService = {
    getRooms: async (): Promise<Room[]> => {
        const url = `${API_ROUTE_BASE}/list`;
        try {
            const response = await axiosInstance.get(url, {
                baseURL: '',
            });

            return response.data;
        } catch (error) {
            console.error("Room Service Error:", error);
            throw error;
        }
    },
    createRoom: async (dto: CreateRoomDto): Promise<Room> => {
        // Next.js Proxy
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, {
            baseURL: ''
        });
        return response.data;
    },

    updateRoom: async (id: number, dto: CreateRoomDto): Promise<void> => {
        // PUT isteği atıyoruz
        await axiosInstance.put(`${API_ROUTE_BASE}/update?id=${id}`, dto, {
            baseURL: '' // Proxy'ye gitmesi için
        });
    },

    async getCopiesByBookId(filter: CopyFilterDto): Promise<PaginatedResult<BookCopy>> {
        const params = new URLSearchParams();
        params.append('bookId', filter.bookId.toString());
        params.append('page', filter.page.toString());
        params.append('size', filter.size.toString());
        if (filter.sortBy) params.append('sortBy', filter.sortBy);
        if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);

        // Endpoint: /api/copy/list (veya uygun gördüğün yer)
        const response = await axiosInstance.get(`/api/copy/list?${params.toString()}`);
        return response.data;
    },

    // Kopya Güncelleme
    async updateCopy(dto: { copyId: number, roomId: number, shelfCode: string }) {
        return axiosInstance.put(`/api/copy/${dto.copyId}`, dto);
    },

    // Kopya Silme
    async deleteCopy(copyId: number) {
        return axiosInstance.delete(`/api/copy/${copyId}`);
    }
}