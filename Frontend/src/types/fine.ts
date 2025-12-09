export interface FineType {
    id: number;
    name: string;
    dailyRate: number;
    description?: string;
}

export interface AssignFineDto {
    userId: string;
    fineTypeId: number;
    reason: string;
    amount?: number;
}