import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$connect();
    return new Response(JSON.stringify({ message: "Prisma DB Connected ✅" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
