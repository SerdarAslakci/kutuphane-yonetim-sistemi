import axiosInstance from "@/src/utils/axiosInstance";
import {Publisher, CreatePublisherDto} from "@/src/types/publisherAndAuthor";
import {PaginatedResult} from "@/src/types/book";

const API_ROUTE_BASE = "/api/publisher";

export const publisherService = {
    getAllPublishers: async (): Promise<Publisher[]> => {
        try{
            console.log("Call Get All Publishers Service");
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/list`, {
                baseURL: ''
            });
            return response.data;
        }catch(error){
            console.error("Error Call Get All Publishers Service", error);
            return [];
        }
    },

    getPublisherPageable: async (page: number, size: number): Promise<PaginatedResult<Publisher>> => {
        console.log("Call Get Pageable Publishers Service");
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/list/pageable?page=${page}&pageSize=${size}`, {
            baseURL: ''
        });
        return response.data;
    },

    createPublisher: async (dto: CreatePublisherDto): Promise<Publisher> => {
        console.log("Call Create Publisher Service");
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, { baseURL: '' });
        return response.data;
    },

    deletePublisher: async (id: number): Promise<void> => {
        console.log("Call Delete Publisher Service", id);
        await axiosInstance.delete(`${API_ROUTE_BASE}/delete?id=${id}`, { baseURL: '' });
    },

    updatePublisher: async (id: number, dto: CreatePublisherDto): Promise<void> => {
        console.log("Call Update Publisher Service");
        await axiosInstance.put(`${API_ROUTE_BASE}/update?id=${id}`, dto, {
            baseURL: ''
        });
    },

    getPublisherByName: async (name: string): Promise<Publisher[]> => {
        try {
            console.log("Call get-by-name Publisher Service");
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/get-by-name?name=${name}`, { baseURL: '' });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) return [];
            throw error;
        }
    },
};