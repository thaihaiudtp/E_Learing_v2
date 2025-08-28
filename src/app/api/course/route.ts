// src/app/api/course/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Hello from GET /api/course" })
}

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({ message: "Received data", data: body })
}
