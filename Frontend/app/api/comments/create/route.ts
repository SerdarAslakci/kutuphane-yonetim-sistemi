import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get("Authorization");

        console.log("Proxy POST /api/comments/create called");
        const response = await axios.post(`${API_BACKEND_URL}/api/BookComment/add-comment`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy POST /api/comments/create response status:", response.status);
        return NextResponse.json(response.data, { status: 201 });
    } catch (err: any) {
        console.error("Proxy GET /api/comments/create error:", err);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Comment Create işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}