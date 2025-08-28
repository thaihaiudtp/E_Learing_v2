import { ResponseDTO } from "@/dto/ResponseDTO";
import { NextRequest } from "next/server";

type Handler<TParams = Record<string, string>> = (
  req: NextRequest,
  context: { params: TParams }
) => Promise<Response>;

export function withAuth<TParams = Record<string, string>>(handler: Handler<TParams>): Handler<TParams> {
  return async (req, context) => {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      const body: ResponseDTO<null> = {
        status: 401,
        data: null,
        error: "Unauthorized",
        message: "You must be logged in to access this resource",
      };
      return new Response(JSON.stringify(body), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return handler(req, context);
  };
}
