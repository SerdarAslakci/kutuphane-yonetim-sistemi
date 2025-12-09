import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { barcode } = body;

        if (!barcode) {
            return NextResponse.json(
                { message: "Barkod numarası zorunludur." },
                { status: 400 }
            );
        }

        const authHeader = request.headers.get("Authorization");

        console.log(`Proxy POST /api/loans/return called for Barcode: ${barcode}`);
        const response = await axios.post(`${API_BACKEND_URL}/api/Loan/return-book`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy POST /api/loans/return succeeded");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy POST /api/loans/return error: ", err?.message);

        if (err.response) {
            return NextResponse.json(err.response.data, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "İade işlemi sırasında sunucuyla iletişim kurulamadı." },
            { status: 500 }
        );
    }
}