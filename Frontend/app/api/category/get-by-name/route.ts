import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');
        const authHeader = request.headers.get("Authorization");

        if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

        console.log("Proxy GET /api/category/get-by-name called. Searching for:", name);
        const response = await axios.get(`${API_BASE_URL}/api/Category/by-name`, {
            params: { name },
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy GET /api/category/get-by-name successful for name:", name);
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy Category Search Error:", err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "Category Get-By-Name işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}