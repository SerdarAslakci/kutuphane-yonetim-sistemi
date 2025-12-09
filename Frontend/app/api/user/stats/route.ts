import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        console.log("Proxy GET /api/user/stats called");

        const response = await axios.get(`${API_BACKEND_URL}/api/User/stats`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy GET /api/user/stats succeeded");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy GET /api/user/stats error:", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "User GET stats işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}