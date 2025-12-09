import { NextResponse } from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(){
    try{
        console.log("Proxy GET /api/category/list called");
        const response = await axios.get(`${API_BASE_URL}/api/Category/list`, {
            headers: {
                'Content-Type': 'application/json',
            },
            // You can add params here if needed
        });
        if (response.status !== 200) {
            return NextResponse.json({ error: "Failed to fetch categories" }, { status: response.status });
        }

        console.log("Proxy GET /api/category/list called successfully");
        return NextResponse.json(response.data);
    }catch(err: any){
        console.error("Proxy GET /api/category/list error:", err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "Category List işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}