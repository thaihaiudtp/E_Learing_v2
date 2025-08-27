import { ResponseDTO } from "@/dto/ResponseDTO";
import { NextRequest } from "next/server";

type Handler = (req: NextRequest, context: any) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
    return async (req, context)=> {
        const token = req.cookies.get("token")?.value;
        if(!token) {
            const body: ResponseDTO = {
                status: 401,
                data: null,
                error: "Unauthorized",
                message: "You must be logged in to access this resource"
            }
            return new Response(JSON.stringify(body), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return handler(req, context);
    }
}