import { LoginDto, RegisterDto, AuthResponse, RefreshTokenDto } from "@/src/types/auth";
import axiosInstance from "@/src/utils/axiosInstance";

const API_ROUTE_BASE = "/api/auth";

export const authService = {
    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse>{
        const response = await fetch(`${API_ROUTE_BASE}/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(refreshTokenDto),
        });

        console.log("Refresh token response status:", response.status);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Token yenileme başarısız.");
        }
        return response.json();
    },

    async login(dto: LoginDto): Promise<AuthResponse> {
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/login`, dto ,{
            baseURL: ''
        });

        return response.data;
    },

    async register(dto: RegisterDto): Promise<void> {
        await axiosInstance.post(`${API_ROUTE_BASE}/register`, dto ,{
            baseURL: ''
        });
    }
};