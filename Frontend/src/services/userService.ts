import axiosInstance from "@/src/utils/axiosInstance";
import {UserFilterDto, UserStats, UserViewDto} from "@/src/types/user";
import {PaginatedResult} from "@/src/types/book";
import {UserProfile} from "@/src/types/auth";

const API_ROUTE_BASE = "/api/user";

export const userService = {
    getUserInfo: async (): Promise<UserProfile> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/info`, {
            baseURL: ''
        });
        return response.data;
    },

    getAllUsers: async (filter: UserFilterDto): Promise<PaginatedResult<UserViewDto>> => {
        const params = new URLSearchParams();

        if (filter.firstName) params.append("FirstName", filter.firstName);
        if (filter.lastName) params.append("LastName", filter.lastName);
        if (filter.email) params.append("Email", filter.email);
        if (filter.role && filter.role !== "Tümü") params.append("Role", filter.role);
        if (filter.hasFine !== undefined) params.append("HasFine", filter.hasFine.toString());

        params.append("Page", filter.page.toString());
        params.append("Size", filter.size.toString());

        const response = await axiosInstance.get(`${API_ROUTE_BASE}/list?${params.toString()}`, {
            baseURL: ''
        });
        return response.data;
    },

    getUserById: async (id: string): Promise<UserViewDto> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/get-details?id=${encodeURIComponent(id)}`, {
            baseURL: ''
        });
        return response.data;
    },

    getStats: async (): Promise<UserStats> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/stats`);
        return response.data;
    },
}