import axiosInstance from "@/src/utils/axiosInstance";
import { DashboardStatus } from "@/src/types/dashboard";

const API_ROUTE_BASE = "/api/dashboard";

export const dashboardService = {
    getStats: async (): Promise<DashboardStatus> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/status`, {
            baseURL: ''
        });
        return response.data;
    }
}