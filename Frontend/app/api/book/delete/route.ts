import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const authHeader = request.headers.get("Authorization");

        console.log("Proxy DELETE /api/book/delete called for ID:", id);
        await axios.delete(`${API_BASE_URL}/api/Book/delete-book/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy DELETE /api/book/delete successful for ID:", id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.log("Proxy Book Delete Error:", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Book Delete failed" }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}