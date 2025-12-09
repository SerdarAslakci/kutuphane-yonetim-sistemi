import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const firstName = searchParams.get('firstName');
        const lastName = searchParams.get('lastName');
        const authHeader = request.headers.get("Authorization");

        console.log("Proxy GET /api/publisher/get-by-name called for Name: ", firstName, lastName);
        const response = await axios.get(`${API_BASE_URL}/api/Authors/by-name`, {
            params: { firstName: firstName, lastName: lastName },
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy GET /api/publisher/get-by-name successful for Name:", firstName, lastName);
        return NextResponse.json(response.data, { status: 200 });

    } catch (err: any) {
        console.error("Proxy Publisher Get By Name Error:", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Publisher get-by-name failed" }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}