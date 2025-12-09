import {BookAuthor, BookCopy} from '@/src/types/bookDetail'
import { Publisher } from '@/src/types/publisherAndAuthor'
import {Category} from '@/src/types/category'

export interface Book {
    id: number;
    title: string;
    isbn: string;
    pageCount: number;
    publicationYear: number;
    language: string;
    category: Category;
    publisher: Publisher;
    bookAuthors: BookAuthor[];
    bookCopies: BookCopy[];
    authorId: number;
    authorFirstName: string;
    authorLastName: string;
    categoryId: number;
    categoryName: string;
    publisherId: number;
    publisherName: string;
    imageUrl: string;
    summary: string;
}


export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface BookFilterDto {
    page?: number;
    size?: number;
    title?: string;
    categoryId?: number;
    authorId?: number;
    publisherId?: number;
    publicationYearFrom?: number;
    publicationYearTo?: number;
    language?: string;
    pageCountMin?: number;
    pageCountMax?: number;
    hasAvailableCopy?: boolean;
    roomCode?: string;
}

export interface CopyFilterDto {
    bookId: number;
    page: number;
    size: number;
    sortBy?: string; // 'shelfCode', 'roomCode', 'barcode'
    sortOrder?: 'asc' | 'desc';
}

export interface CreateBookResponseDto{
    id: number;
}

export interface CreateBookCopyResponseDto{
    id: number;
}

export interface CreateCopyBookDto{
    bookId: number;
    shelfCode: string;
    barcodeNumber: string;
    roomId: number;
}

export interface CreateBookDto {
    title?: string;
    isbn?: string;
    pageCount: number;
    publicationYear: number;
    language?: string;
    authorId?: number;
    authorFirstName?: string;
    authorLastName?: string;
    categoryId?: number;
    categoryName?: string;
    publisherId?: number;
    publisherName?: string;
    imageUrl?: string;
    summary?: string;
}

export interface UpdateBookDto {
    id: number;
    title: string;
    isbn: string;
    pageCount: number;
    publicationYear: number;
    language: string;
    authorId: number;
    publisherId: number;
    categoryId: number;
    imageUrl: string;
    summary: string;
}

export interface BookComment {
    id: number;
    userName: string; // Veya User nesnesi
    content: string;
    rating: number; // 1-5 arası
    createdAt: string;
}