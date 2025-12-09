export interface BookComment {
    id: number;
    bookId: number;
    userId: string;
    userFullName: string;
    content: string;
    rating: number;
    createdAt: string;
}

export interface CreateCommentDto {
    bookId: number;
    content: string;
    rating: number;
}

export interface PaginatedComments {
    items: BookComment[];
    totalCount: number;
    page: number;
    size: number;
    totalPages: number;
}