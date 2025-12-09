import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        console.log(`Proxy GET /api/book/get-by-name called. Searching for: ${name}`);

        if (!name || name.trim() === '') {
            return NextResponse.json({ error: "Kitap ismi zorunludur." }, { status: 400 });
        }

        const authHeader = request.headers.get("Authorization");

        const response = await axios.get(`${API_BASE_URL}/api/Book/get-by-name`, {
            params: { name: name },
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy Search Error:", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Book Get-By-Name işlemi başarısız." }, { status: err.response.status });
        }

        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}