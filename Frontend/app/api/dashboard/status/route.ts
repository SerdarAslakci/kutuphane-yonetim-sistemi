import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        const response = await axios.get(`${API_BASE_URL}/api/Dashboard`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Dashboard Status Get Error:", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Dashboard Status Get işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}