import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ResponseDTO } from "@/dto/ResponseDTO";

// context là optional
type Handler<TParams = Record<string, string>> = (
  req: NextRequest,
  context?: { params: TParams }
) => Promise<Response>;

export function withAuth<TParams = Record<string, string>>(handler: Handler<TParams>): Handler<TParams> {
  return async (req, context) => {
    const session = await getServerSession(authOptions);

    if (!session) {
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

export function withAuthAdmin<TParams = Record<string, string>>(handler: Handler<TParams>): Handler<TParams> {
  return async (req, context) => {
    const session = await getServerSession(authOptions);

    if (!session) {
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

    if (session.user.role !== "ADMIN") {
      const body: ResponseDTO<null> = {
        status: 403,
        data: null,
        error: "Forbidden",
        message: "You do not have permission to access this resource",
      };
      return new Response(JSON.stringify(body), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return handler(req, context);
  };
}
