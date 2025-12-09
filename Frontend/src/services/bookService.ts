import type {
    BookFilterDto,
    PaginatedResult,
    Book,
    CreateBookDto,
    CreateBookResponseDto,
    UpdateBookDto
} from "@/src/types/book";
import type { BookDetail } from "@/src/types/bookDetail";
import axiosInstance from "@/src/utils/axiosInstance";

const API_ROUTE_BASE = "/api/book";

export const bookService = {
    async getAllBooks(filter: BookFilterDto): Promise<PaginatedResult<Book>> {
        const params = new URLSearchParams();

        const appendIfDefined = (key: string, value: any) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        };
        appendIfDefined("Page", filter.page ?? 1);
        appendIfDefined("Size", filter.size ?? 12);

        appendIfDefined("Title", filter.title);
        appendIfDefined("CategoryId", filter.categoryId);
        appendIfDefined("AuthorId", filter.authorId);
        appendIfDefined("PublisherId", filter.publisherId);
        appendIfDefined("RoomCode", filter.roomCode);

        appendIfDefined("PublicationYearFrom", filter.publicationYearFrom);
        appendIfDefined("PublicationYearTo", filter.publicationYearTo);
        appendIfDefined("PageCountMin", filter.pageCountMin);
        appendIfDefined("PageCountMax", filter.pageCountMax);

        appendIfDefined("Language", filter.language);
        appendIfDefined("HasAvailableCopy", filter.hasAvailableCopy);

        const url = `${API_ROUTE_BASE}/list?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Kitaplar listelenirken hata oluştu.");
        }

        return response.json();
    },

    async getBookByName(name: string): Promise<Book[]> {
        try {
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/get-by-name`, {
                params: { name },
                baseURL: ''
            });

            return response.data;
        } catch (error: any) {
            console.error("Kitap arama hatası:", error);
            return [];
        }
    },

    createBook: async (dto: CreateBookDto): Promise<CreateBookResponseDto> => {
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, {
            baseURL: ''
        });
        return response.data;
    },

    updateBook: async (id: number, dto: UpdateBookDto): Promise<void> => {
        await axiosInstance.put(`${API_ROUTE_BASE}/update?id=${id}`, dto, { baseURL: '' });
    },

    deleteBook: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_ROUTE_BASE}/delete?id=${id}`, { baseURL: '' });
    },

    async getBookDetails(id: number): Promise<BookDetail> {
        const url = `${API_ROUTE_BASE}/get-book-details?id=${id}`;

        console.log("Fetching book details from URL:", url);

        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
            throw new Error("Failed to fetch book details");
        }
        return response.json();
    },

    async getBooksByAuthor(authorId: number, currentBookId: number, categoryId: number): Promise<Book[]> {
        const params = new URLSearchParams();
        params.set('authorId', authorId.toString());
        params.set('size', '5'); // Sadece 5 tane getir
        params.set('categoryId', categoryId.toString());

        const url = `${API_ROUTE_BASE}/get-by-author?${params.toString()}`;
        const response = await fetch(url, { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) return [];
        if (!data || !data.items) return [];
        return data.items.filter((b: Book) => b.id !== currentBookId);
    }
};