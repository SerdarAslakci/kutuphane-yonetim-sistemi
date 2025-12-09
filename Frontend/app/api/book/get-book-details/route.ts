// src/app/api/book/get-book-details/route.ts
import { NextResponse, NextRequest } from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('id');

        console.log("Proxy GET /api/Book/get-book-details called", bookId);

        if (!bookId) {
            return NextResponse.json({ error: "id parametresi eksik." }, { status: 400 });
        }

        const response = await axios.get(`${API_BASE_URL}/api/Book/get-book-details/${bookId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Proxy GET /api/Book/get-book-details called successfully");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy GET /api/Book/get-book-details error:", err?.response?.data || err.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Kitap detayları alınamadı." }, { status: err.response.status });
        }

        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}