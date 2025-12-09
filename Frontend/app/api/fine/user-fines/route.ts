import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const authHeader = request.headers.get("Authorization");

        console.log("Proxy GET /api/fine/user-fines called for Email:", email);
        const response = await axios.get(`${API_BASE_URL}/api/Fine/by-email`, {
            params: { email },
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy GET /api/fine/user-fines successful for Email:", email);;
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy User Fines Get Error:", err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "Fine User-Fines Get işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}