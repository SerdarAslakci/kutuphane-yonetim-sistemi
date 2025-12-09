import {NextRequest, NextResponse} from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;


export async function POST(request: NextRequest) {
    try {
        console.log("Proxy POST /api/auth/register called");
        const body = await request.json();

        const response = await axios.post(`${API_BASE_URL}/api/Auth/register`, body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Proxy POST /api/auth/register called successfully");

        return NextResponse.json(response.data, {status: 200});
    } catch (err: any) {
        console.error("Proxy POST /api/auth/register error:", err.response.data);
        if (err.response) {
            return NextResponse.json(err.response.data, { status: err.response.status });
        }

        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}