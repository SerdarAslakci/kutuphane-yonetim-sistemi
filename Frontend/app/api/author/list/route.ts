import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        console.log("Proxy GET /api/author/list called");

        const authHeader = request.headers.get("Authorization");

        const response = await axios.get(`${API_BASE_URL}/api/Authors`,{
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy GET /api/author/list succeeded");
        return new NextResponse(JSON.stringify(response.data), {
            status: response.status,
            headers: { "content-type": "application/json" },
        });
    } catch (err: any) {
        console.error("Proxy GET /api/author/list error: ", err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "Author Listeleme işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}