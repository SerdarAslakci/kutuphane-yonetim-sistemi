import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

const API_ROUTE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request:NextRequest){
    try{
        const url = new URL(request.url);
        const query = url.search;

        console.log("Proxy GET /api/loans/my-active-loans called with query:", query);
        const authHeader = request.headers.get("Authorization");
        const response = await axios.get(`${API_ROUTE_URL}/api/Loan/my-active-loans${query}`,{
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy GET /api/loans/my-active-loans successful");
        return NextResponse.json(response.data, { status: 200 });
    }catch(err:any){
        console.error("Proxy GET /api/loans/my-active-loans error: ", err?.message);

        if (err.response){
            return NextResponse.json(err.response.data || { error: "Loans Active Get işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}