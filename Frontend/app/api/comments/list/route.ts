import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('BookId');
        const page = searchParams.get('page') || '1';
        const size = searchParams.get('pageSize') || '5';

        if (!bookId) {
            return NextResponse.json({ error: "BookId parametresi gerekli." }, { status: 400 });
        }
        console.log("Proxy GET /api/comments/list called with BookId:", bookId, "Page:", page, "Size:", size);

        const response = await axios.get(`${API_BACKEND_URL}/api/BookComment/get-comments?BookId=${bookId}&page=${page}&pageSize=${size}`, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log("Proxy GET /api/comments/list response status:", response.status);
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy GET /api/comments/list error:", err);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Comment List işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}