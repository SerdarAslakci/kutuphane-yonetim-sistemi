import { Shelf } from '@/src/types/roomAndShelf';
import { Category } from "@/src/types/category";
import { Author, Publisher } from "@/src/types/publisherAndAuthor";

// src/types/book.ts

export interface BookAuthor {
    bookId: number;
    authorId: number;
    author: Author;
}

export interface BookCopy {
    id: number;
    barcodeNumber: string;
    isAvailable: boolean;
    shelf: Shelf;
}

export interface UpdateBookCopyDto {
    id: number;
    barcodeNumber?: string;
    roomId?: number;
    shelfCode?: string;
    isAvailable?: boolean;
}

export interface BookDetail {
    id: number;
    title: string;
    isbn: string;
    pageCount: number;
    publicationYear: number;
    language: string;
    description?: string; // Backend modelinde yok ama genelde olur, UI için ekledim
    imageUrl: string;
    summary: string;
    category: Category;
    publisher: Publisher;
    bookAuthors: BookAuthor[];
    bookCopies: BookCopy[];
}