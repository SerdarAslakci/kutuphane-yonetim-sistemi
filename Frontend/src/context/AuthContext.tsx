'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from "@/src/types/authContextType";
import { AuthResponse, LoginDto, RegisterDto, UserProfile } from "@/src/types/auth";
import { authService } from "@/src/services/authService";
import { userService } from "@/src/services/userService";
import toast from "react-hot-toast";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("token");
    }
    return null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeAuth = () => {
            if (typeof window !== 'undefined') {
                const storedToken = localStorage.getItem("token");
                const storedRefreshToken = localStorage.getItem("refreshToken");
                const storedUserProfile = localStorage.getItem("userProfile");

                if (storedToken && storedUserProfile) {
                    try {
                        const parsedUser = JSON.parse(storedUserProfile);
                        setToken(storedToken);
                        setRefreshToken(storedRefreshToken);
                        setUser(parsedUser);
                    } catch (error) {
                        console.error("Auth verisi bozuk, temizleniyor:", error);
                        localStorage.clear();
                    }
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (dto: LoginDto) => {
        try {
            setIsLoading(true);
            const response: AuthResponse = await authService.login(dto);

            localStorage.setItem("token", response.token);
            localStorage.setItem("refreshToken", response.refreshToken);

            const userProfileDetails: UserProfile = await userService.getUserInfo();
            localStorage.setItem("userProfile", JSON.stringify(userProfileDetails));

            setRefreshToken(response.refreshToken);
            setToken(response.token);
            setUser(userProfileDetails);
        } catch (error: any) {
            console.error("Giriş İşlemi Başarısız: ", error);

            let errorMessage = "İşlem başarısız.";

            if (error.response && error.response.data) {
                errorMessage = error.response.data.message ||
                    error.response.data.error ||
                    (typeof error.response.data === 'string' ? error.response.data : "İşlem başarısız.");
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (dto: RegisterDto) => {
        try {
            setIsLoading(true);
            await authService.register(dto);
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userProfile');
        setToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    const userId = user?.id ?? null;

    return (
        <AuthContext.Provider value={{
            user,
            userId,
            token,
            refreshToken,
            isAuthenticated: !!user && !!token,
            login,
            register,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};