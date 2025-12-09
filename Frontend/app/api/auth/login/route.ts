import { NextResponse, NextRequest } from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await axios.post(`${API_BASE_URL}/api/Auth/login`, body, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return NextResponse.json(response.data, { status: 200 });

    } catch (err: any) {
        console.error("Proxy Login Error:", err.response.data);

        if (err.response) {
            return NextResponse.json(err.response.data || "E-posta adresi veya parola hatalı. Lütfen bilgilerinizi kontrol edin.", { status: err.response.status });
        }

        return NextResponse.json(
            { message: "Sunucuya erişilemiyor. Lütfen bağlantınızı kontrol edin." },
            { status: 500 }
        );
    }
}