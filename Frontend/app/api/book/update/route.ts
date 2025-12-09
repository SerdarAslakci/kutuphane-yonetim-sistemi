import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const authHeader = request.headers.get("Authorization");
        const body = await request.json();
        console.log("Proxy PUT /api/book/update called for ID:", id);

        await axios.put(`${API_BASE_URL}/api/Book/update-book/${id}`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy PUT /api/book/update successful for ID:", id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.error("Proxy Book Update Error:", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Book Update işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}