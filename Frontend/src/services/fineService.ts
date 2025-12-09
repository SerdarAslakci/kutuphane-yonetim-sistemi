import axiosInstance from "@/src/utils/axiosInstance";
import {AssignFineDto, FineType} from "@/src/types/fine";
import {UserFineDto} from "@/src/types/user";
import {PaginatedResult} from "@/src/types/book";

const API_ROUTE_BASE = "/api/fine";


export const fineService = {
    getFineTypes: async (): Promise<FineType[]> => {
        try {
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/types`, {
                baseURL: ''
            });
            return response.data;
        } catch (error) {
            console.error("Ceza tipleri alma hatası:", error);
            return [];
        }
    },

    assignFine: async (dto: AssignFineDto): Promise<void> => {
        await axiosInstance.post(`${API_ROUTE_BASE}/assign`, dto, {
            baseURL: ''
        });
    },

    revokeFineById: async (fineId: number): Promise<void> => {
        await axiosInstance.post(`${API_ROUTE_BASE}/revoke?id=${fineId}`, {}, { baseURL: '' });
    },

    getUserFinesByEmail: async (email: string): Promise<UserFineDto[]> => {
        try {
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/user-fines?email=${email}`, {
                baseURL: ''
            });
            return response.data;
        } catch (error) {
            console.error("Kullanıcı cezaları alınamadı:", error);
            return [];
        }
    },

    getMyActiveFines: async (page: number, size: number): Promise<PaginatedResult<UserFineDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/get-active-fines?page=${page}&pageSize=${size}`, {
            baseURL: ''
        });
        return response.data;
    },

    getMyHistoryFines: async (page: number, size: number): Promise<PaginatedResult<UserFineDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/get-past-fines?page=${page}&pageSize=${size}`, {
            baseURL: ''
        });
        return response.data;
    },

    payFine: async (fineId: string): Promise<void> => {
        await axiosInstance.post(`${API_ROUTE_BASE}/pay?fineId=${fineId}`, {
            baseURL: ''
        });
    }
}