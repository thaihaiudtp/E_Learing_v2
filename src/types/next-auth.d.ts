import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      isValid: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    email: string
    isValid: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    email: string
    isValid: boolean
  }
}
