import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        console.log("Proxy GET /api/shelf/list called");

        const authHeader = request.headers.get("Authorization");

        const searchParams = request.nextUrl.searchParams;
        const roomId = searchParams.get('roomId');

        if (!roomId) {
            return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
        }
        console.log("Proxy GET /api/shelf/list called");
        const response = await axios.get(`${API_BASE_URL}/api/Shelf/room/${roomId}`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy GET /api/shelf/list succeeded");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy GET /api/shelf/list error: ", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Shelf List işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}