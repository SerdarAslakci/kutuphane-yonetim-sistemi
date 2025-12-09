import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        const body = await request.json();

        console.log("Proxy POST /api/Category/create called");
        const response = await axios.post(`${API_BASE_URL}/api/Category`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy POST /api/Category/create called successfully");

        return NextResponse.json(response.data, { status: 201 });
    } catch (err: any) {
        console.error("Proxy Category Add Error:", err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "Category Create işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}