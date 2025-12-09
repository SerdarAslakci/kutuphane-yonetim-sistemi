import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const pageSize = searchParams.get('pageSize') || '10';

        const authHeader = request.headers.get("Authorization");
        console.log(`Proxy GET /api/fine/get-past-fines called Page: ${page}`);

        const response = await axios.get(`${API_BACKEND_URL}/api/Fine/my-history-fines?page=${page}&pageSize=${pageSize}`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy GET /api/fine/get-past-fines succeeded");
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy GET /api/fine/get-past-fines error: ", err?.message);
        const status = err.response?.status || 500;
        if (status === 404) {
            return NextResponse.json({ items: [], totalCount: 0 }, { status: 200 });
        }
        return NextResponse.json(
            err.response?.data || { error: "Fines fetch failed" },
            { status: status }
        );
    }
}