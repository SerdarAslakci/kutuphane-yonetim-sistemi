import {LoginDto, RegisterDto, UserProfile} from "@/src/types/auth";

export interface AuthContextType{
    user: UserProfile | null;
    userId: string | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (dto: LoginDto) => Promise<void>;
    register: (dto: RegisterDto) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}