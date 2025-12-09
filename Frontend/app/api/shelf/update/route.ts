import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function PUT(request: NextRequest) {
    try {
        console.log("Proxy PUT /api/shelf/update called");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Shelf ID is required" }, { status: 400 });
        }

        const authHeader = request.headers.get("Authorization");
        const body = await request.json();
        console.log("Proxy PUT /api/shelf/update called");
        const response = await axios.put(`${API_BASE_URL}/api/Shelf/${id}`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy PUT /api/shelf/update successfully");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy  Update Error:", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Shelf Update işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}