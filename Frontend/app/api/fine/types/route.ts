import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        console.log("Proxy GET /api/fine/types called");
        const response = await axios.get(`${API_BASE_URL}/api/FineType`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy GET /api/fine/types successful");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy GET /api/fine/types error: ",err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "Fine Types Get işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}