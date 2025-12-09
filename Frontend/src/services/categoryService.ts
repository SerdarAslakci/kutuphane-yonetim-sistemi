import axiosInstance from "@/src/utils/axiosInstance";
import { Category, CreateCategoryDto } from "@/src/types/category";
import {PaginatedResult} from "@/src/types/book";

const API_ROUTE_BASE = "/api/category";

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        const url = `${API_ROUTE_BASE}/list`;
        console.log("Fetching categories from URL:", url);
        const response = await fetch(url, {cache: "no-cache" });

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        return response.json();
    },

    async getCategoriesPageable(page: number, size: number): Promise<PaginatedResult<Category>> {
        console.log("Call Get Pageable Categories Service");
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/list/pageable?page=${page}&size=${size}`, {
            baseURL: ''
        });

        return response.data;
    },

    createCategory: async (dto: CreateCategoryDto): Promise<Category> => {
        console.log("Call Create Category Service");
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, {
            baseURL: ''
        });
        return response.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        console.log("Call Delete Category Service", id);
        await axiosInstance.delete(`${API_ROUTE_BASE}/delete?id=${id}`, { baseURL: '' });
    },

    updateCategory: async (id: number, dto: CreateCategoryDto): Promise<void> => {
        console.log("Call Update Category Service");
        await axiosInstance.put(`${API_ROUTE_BASE}/update?id=${id}`, dto, {
            baseURL: ''
        });
    },

    getCategoryByName: async (name: string): Promise<Category[]> => {
        try {
            console.log("Call get-by-name Category Service");
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/get-by-name?name=${name}`, { baseURL: '' });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) return [];
            throw error;
        }
    },
}