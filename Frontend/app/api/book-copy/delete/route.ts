import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const authHeader = request.headers.get("Authorization");

        if (!id) {
            return NextResponse.json({ error: "Copy ID is required" }, { status: 400 });
        }
        console.log("Proxy DELETE /api/book-copies/delete called for ID:", id);
        const response = await axios.delete(`${API_BACKEND_URL}/api/Book/delete-book-copy/${id}`, {
            headers: {
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy DELETE /api/book-copies/delete succeeded.")
        return NextResponse.json(response.data || { success: true }, { status: 200 });
    } catch (err: any) {
        console.error("Proxy DELETE /api/book-copies/delete error:", err?.message);
        const status = err.response?.status || 500;
        return NextResponse.json(err.response?.data || { error: "Delete failed" }, { status });
    }
}