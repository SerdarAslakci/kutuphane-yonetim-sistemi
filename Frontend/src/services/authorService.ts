import axiosInstance from "@/src/utils/axiosInstance";
import {Author, CreateAuthorDto, UpdateAuthorDto} from "@/src/types/publisherAndAuthor";
import {PaginatedResult} from "@/src/types/book";

const API_ROUTE_BASE = "/api/author";

export const authorService = {
    getAllAuthors: async (): Promise<Author[]> => {
        try {
            console.log("Fetching authors from API");
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/list`, {
                baseURL: ''
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching authors:", error);
            return [];
        }
    },

    getAllAuthorPageable: async (page: number, size: number): Promise<PaginatedResult<Author>> => {
        console.log("Fetching pageable authors from API");
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/list/pageable?page=${page}&pageSize=${size}`, {
            baseURL: ''
        });
        return response.data;
    },

    getAuthorByNameAndLastName: async (firstName: string, lastName: string): Promise<Author[]> => {
        try {
            console.log("Call get-by-name Publisher Service");
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/get-by-name?firstName=${firstName}&lastName=${lastName}`, {
                baseURL: ''
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) return [];
            throw error;
        }
    },

    createAuthor: async (dto: CreateAuthorDto): Promise<Author> => {
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, {
            baseURL: ''
        });
        return response.data;
    },

    updateAuthor: async (dto: UpdateAuthorDto): Promise<void> =>{
        await axiosInstance.put(`${API_ROUTE_BASE}/update?id=${dto.id}`, dto, {baseURL: ''});

    },

    deleteAuthor: async (id: number): Promise<boolean> => {
        const response = await axiosInstance.delete(`${API_ROUTE_BASE}/delete?id=${id}`, {baseURL: ''});
        return response.data;
    }
};