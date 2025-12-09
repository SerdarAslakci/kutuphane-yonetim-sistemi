import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.toString();
        console.log("Proxy GET /api/books/list called with params:", query);

        const response = await axios.get(`${API_BACKEND_URL}/api/Book/get-all-books?${query}`);

        console.log("Proxy GET /api/books/list succeeded");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy GET /api/books/list error: ", err?.message);

        const status = err.response?.status || 500;
        if (status === 404) {
            return NextResponse.json({
                items: [],
                totalCount: 0,
                totalPages: 0,
                pageNumber: 1
            }, { status: 200 });
        }
        const errorMessage = err.response?.data || { error: "Kitap listeleme başarısız." };
        return NextResponse.json(errorMessage, { status: status });
    }
}