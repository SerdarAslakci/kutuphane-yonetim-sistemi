import {NextRequest, NextResponse} from 'next/server';

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request:NextRequest) {
    try {
        console.log("Proxy GET /api/room/list called");
        const authHeader = request.headers.get("Authorization");
        const config = {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        };

        const response = await axios.get(`${API_BASE_URL}/api/Room`,config);
        console.log("Proxy GET /api/room/list succeeded");
        return new NextResponse(JSON.stringify(response.data), {
            status: response.status,
            headers: {
                "Content-type": "application/json"
            },
        });
    } catch (err: any) {
        console.error("Proxy GET /api/room/list error:", err);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Room List işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}