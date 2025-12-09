import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        console.log("Proxy GET /api/user/list called");

        const authHeader = request.headers.get("Authorization");

        const searchParams = request.nextUrl.searchParams;
        const axiosParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            axiosParams[key] = value;
        });
        console.log("Forwarding Params to Backend:", axiosParams);

        const response = await axios.get(`${API_BASE_URL}/api/User`, { ///get-all-users
            params: axiosParams, // Query parametreleri buraya
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy GET /api/user/list Error:", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "User List işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}