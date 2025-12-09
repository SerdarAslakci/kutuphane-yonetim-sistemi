import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const fineId = searchParams.get('fineId');
        if (!fineId) {
            return NextResponse.json(
                { message: "Ceza ID'si (fineId) zorunludur." },
                { status: 400 }
            );
        }
        const authHeader = request.headers.get("Authorization");
        console.log(`Proxy POST /api/fines/pay called for FineID: ${fineId}`);
        const response = await axios.post(
            `${API_BACKEND_URL}/api/Fine/pay?fineId=${fineId}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(authHeader && { "Authorization": authHeader })
                }
            }
        );
        console.log("Proxy POST /api/fines/pay succeeded");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy POST /api/fines/pay error: ", err?.message);
        if (err.response) {
            return NextResponse.json(err.response.data, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Ödeme işlemi sırasında sunucuyla iletişim kurulamadı." },
            { status: 500 }
        );
    }
}