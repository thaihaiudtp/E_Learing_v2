import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
export async function checkSession() {
  const session = await getServerSession(authOptions);
  if (session) {
    return session;
  } else {
    throw new Error("Unauthorized");
  }
}
