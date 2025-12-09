import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json(); // UpdateBookCopyDto
        const authHeader = request.headers.get("Authorization");

        console.log("Proxy PUT /api/book-copies/update called for ID:", body.id);

        const response = await axios.put(`${API_BACKEND_URL}/api/Book/update-book-copy/${body.id}`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy PUT /api/book-copies/update successful for ID:", body.id);
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy PUT /api/book-copies/update error:", err?.message);
        const status = err.response?.status || 500;
        return NextResponse.json(err.response?.data || { error: "Update failed" }, { status });
    }
}