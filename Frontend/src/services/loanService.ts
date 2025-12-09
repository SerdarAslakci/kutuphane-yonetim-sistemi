import axiosInstance from "@/src/utils/axiosInstance";
import {CreateLoanDto, LoanDto, LoanWithUserDetailsDto, ReturnLoanResponseDto} from '@/src/types/loan';
import {PaginatedResult} from "@/src/types/book";

const API_ROUTE_BASE = "/api/loans";

export const loanService = {
    createLoan: async (dto: CreateLoanDto): Promise<void> => {
        await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, {
            baseURL: ''
        });
    },

    getAllActiveLoans: async (page: number = 1, size: number = 10): Promise<PaginatedResult<LoanWithUserDetailsDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/active?page=${page}&pageSize=${size}`, {
            baseURL: ''
        });
        return response.data;
    },

    getOverdueLoans: async (page: number = 1, size: number = 10): Promise<PaginatedResult<LoanWithUserDetailsDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/overdue?page=${page}&pageSize=${size}`, {
            baseURL: '',
        });
        return response.data;
    },

    getHistoryLoans: async (page: number = 1, size: number = 10): Promise<PaginatedResult<LoanWithUserDetailsDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/history?page=${page}&pageSize=${size}`, {
            baseURL: '',
        });
        return response.data;
    },

    returnBook: async (barcode: string): Promise<ReturnLoanResponseDto> => {
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/return`, { barcode },{
            baseURL: '',
        });
        return response.data;
    },

    getMyActiveLoans: async (page: number, size: number): Promise<PaginatedResult<LoanDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/my-active-loans?page=${page}&pageSize=${size}`, {
            baseURL: '',
        });
        return response.data;
    },

    getMyPastLoans: async (page: number, size: number): Promise<PaginatedResult<LoanDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/my-returned-loans?page=${page}&pageSize=${size}`, {
            baseURL: '',
        });
        return response.data;
    }
};