import axiosInstance from "@/src/utils/axiosInstance";
import {CopyFilterDto, CreateBookCopyResponseDto, CreateCopyBookDto, PaginatedResult} from "@/src/types/book";
import {BookCopy, UpdateBookCopyDto} from "@/src/types/bookDetail";

const API_ROUTE_BASE = "/api/book-copy";

export const bookCopyService = {
    createCopy: async (dto: CreateCopyBookDto): Promise<CreateBookCopyResponseDto> => {
        console.log("Book Copy Service - CreateCopy called");
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, {
            baseURL: ''
        });

        return response.data;
    },
    async getCopiesByBookId(bookId:number, page:number, size:number): Promise<PaginatedResult<BookCopy>> {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/by-book?id=${bookId}&page=${page}&pageSize=${size}`, {
            baseURL: '',
        });

        return response.data;
    },

    updateCopy: async(dto: UpdateBookCopyDto): Promise<void> => {
        await axiosInstance.put(`${API_ROUTE_BASE}/update`, dto, {
            baseURL: ''
        });
    },

    deleteCopy: async (copyId: number): Promise<void> => {
        await axiosInstance.delete(`${API_ROUTE_BASE}/delete?id=${copyId}`, {
            baseURL: ''
        });
    },
}