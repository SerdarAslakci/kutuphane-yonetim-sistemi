import { LoanInfo } from "@/src/types/loan";

export interface UserViewDto {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    roles: string[];
    loanBookCount: number;
    hasFine: boolean;
    createdAt: string;
}

export interface UserFilterDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    name?: string;
    role?: string;
    hasFine?: boolean;
    page: number;
    size: number;
}

export interface UserFineDto{
    fineId: number;
    amount: number;
    status: string;
    isActive: boolean;
    issuedDate: string;
    fineType: string;
    description: string;

    loanDetails?: LoanInfo;
}

export interface UserStats {
    activeLoanCount: number;
    totalReadCount: number;
    totalFineDebt: number;
}