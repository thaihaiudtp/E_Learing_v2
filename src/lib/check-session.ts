import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function checkSession() {
  const session = await getServerSession(authOptions);
  if (session) {
    return session;
  } else {
    throw new Error("Unauthorized");
  }
}
