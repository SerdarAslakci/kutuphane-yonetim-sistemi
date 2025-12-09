import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const queryParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });
        console.log("Query Parameters for Author Books:", queryParams);
        const response = await axios.get(`${API_BASE_URL}/api/Book/other-by-author`, {
            params: queryParams,
            headers: {
                "Content-Type": "application/json",
            },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy List Error:", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Kitap listesi alınırken hata oluştu." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}