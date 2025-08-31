import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ResponseDTO } from "@/dto/ResponseDTO";

// Type for handlers with params
type HandlerWithParams = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<Response>;

// Union type for all handlers
type Handler = 
  | ((req: NextRequest) => Promise<Response>)
  | HandlerWithParams;

// Overload for handlers without params
export function withAuth(handler: (req: NextRequest) => Promise<Response>): (req: NextRequest) => Promise<Response>;
// Overload for handlers with params
export function withAuth(handler: HandlerWithParams): HandlerWithParams;

export function withAuth(handler: Handler): Handler {
  return async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
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

    // Call handler with appropriate arguments using type assertion
    if (handler.length === 1) {
      return (handler as (req: NextRequest) => Promise<Response>)(req);
    } else {
      if (context) {
        return (handler as HandlerWithParams)(req, context);
      } else {
        throw new Error('Handler requires context but none provided');
      }
    }
  };
}

// Overload for admin without params
export function withAuthAdmin(handler: (req: NextRequest) => Promise<Response>): (req: NextRequest) => Promise<Response>;
// Overload for admin with params
export function withAuthAdmin(handler: HandlerWithParams): HandlerWithParams;

export function withAuthAdmin(handler: Handler): Handler {
  return async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
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

    // Call handler with appropriate arguments using type assertion
    if (handler.length === 1) {
      return (handler as (req: NextRequest) => Promise<Response>)(req);
    } else {
      if (context) {
        return (handler as HandlerWithParams)(req, context);
      } else {
        throw new Error('Handler requires context but none provided');
      }
    }
  };
}
