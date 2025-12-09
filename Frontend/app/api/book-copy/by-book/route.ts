import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const bookId = searchParams.get('id');
        const page = searchParams.get('page') || '1';
        const pageSize = searchParams.get('pageSize') || '10';
        const authHeader = request.headers.get("Authorization");

        if (!bookId) {
            return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
        }

        console.log(`Proxy GET /api/book-copies/by-book called for BookID: ${bookId}`);
        const response = await axios.get(`${API_BACKEND_URL}/api/Book/all-book-copies?BookId=${bookId}&page=${page}&pageSize=${pageSize}`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy GET /api/book-copies/by-book successfully")
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy GET /api/book-copies/by-book error:", err?.message);
        const status = err.response?.status || 500;
        return NextResponse.json(err.response?.data || { error: "Fetch failed" }, { status });
    }
}