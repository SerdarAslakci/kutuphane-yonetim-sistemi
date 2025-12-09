export interface Category{
    id: number;
    name: string;
    bookCount?: number;
}

export interface CreateCategoryDto {
    name: string;
}