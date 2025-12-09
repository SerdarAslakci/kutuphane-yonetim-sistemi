import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const authHeader = request.headers.get("Authorization");
        const body = await request.json();

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        console.log("Proxy PUT /api/publisher/update called for ID:", id);
        await axios.put(`${API_BASE_URL}/api/Publishers/${id}`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("PUT /api/publisher/update called for ID:", id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.error("Proxy PUT /api/publisher/update error:", err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "Publisher Update işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}