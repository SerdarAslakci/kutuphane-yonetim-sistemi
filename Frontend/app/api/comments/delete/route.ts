import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get('id');

        if (!commentId) {
            return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
        }

        const authHeader = request.headers.get("Authorization");

        console.log(`Proxy DELETE /api/comments/delete called for ID: ${commentId}`);

        await axios.delete(`${API_BACKEND_URL}/api/BookComment/delete-comment/${commentId}`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy DELETE /api/comments/delete successful");
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.error("Proxy Delete Comment Error:", err?.message);

        if (err.response) {
            return NextResponse.json(err.response.data, { status: err.response.status });
        }

        return NextResponse.json({ error: "Silme işlemi başarısız." }, { status: 500 });
    }
}