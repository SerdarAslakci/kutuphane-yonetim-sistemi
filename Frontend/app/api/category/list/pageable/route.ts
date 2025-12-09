import {NextResponse} from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const query = url.search;

        console.log("Category Pageable List Query Information ", query);

        const response = await axios.get(`${API_BASE_URL}/api/Category/pageable${query}`);

        return new NextResponse(JSON.stringify(response.data), {
            status: response.status,
            headers: {"content-type": "application/json"},
        });
    } catch (err: any) {
        console.error("Proxy GET /api/category/pageable-list hata:", err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "Category Pageable List işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}