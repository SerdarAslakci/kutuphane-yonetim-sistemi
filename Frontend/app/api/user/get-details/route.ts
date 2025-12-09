import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        console.log(`Proxy GET /api/users/get-details called. ID: ${id}`);
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const authHeader = request.headers.get("Authorization");

        const response = await axios.get(`${API_BASE_URL}/api/User/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy GET /api/users/get-details successful.");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error(`Proxy GET /api/users/get-details error: `, err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "User Get-Details işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}