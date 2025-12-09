export interface LoginDto {
    email: string;
    password: string;
}

export interface RefreshTokenDto {
    token: string;
    refreshToken: string;
}

export interface RegisterDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    dateOfBirth: string;
}

export interface AuthResponse {
    token: string;
    expiration: string;
    user: UserProfile;
    refreshToken: string;
}

export interface UserProfile{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    roles: string[];
}