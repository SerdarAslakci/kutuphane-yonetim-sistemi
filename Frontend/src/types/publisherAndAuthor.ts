export interface Author {
    id: number;
    firstName: string;
    lastName: string;
}

export interface Publisher {
    id: number;
    name: string;
}

export interface CreateAuthorDto {
    firstName: string;
    lastName: string;
}

export interface UpdateAuthorDto {
    id: number;
    firstName: string;
    lastName: string;
}

export interface CreatePublisherDto {
    name: string;
}