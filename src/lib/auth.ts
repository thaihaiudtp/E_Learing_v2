
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { compare } from "bcrypt"
import { userData } from "@/types/type"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        })
        if (!user || !user.password) return null

        const valid = await compare(credentials!.password, user.password)
        if (!valid) return null

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isValid: user.isValid,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24h
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      if (account?.provider === "google") {
        token.accessToken = account.access_token
      }
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.isValid = user.isValid
      } else if (trigger === "update" && session?.user) {
        if (session.user.isValid !== undefined) {
          token.isValid = session.user.isValid
        }
      } else if (token.email && (token.isValid === undefined || token.id === undefined)) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, isValid: true, name: true },
        })
        if (dbUser) {
          token.id = dbUser.id.toString()
          token.isValid = dbUser.isValid
          token.name = dbUser.name
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
        session.user.isValid = token.isValid as boolean
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                name: user.name!,
                email: user.email!,
                password: "", // google user -> empty
                isValid: false, // mặc định false
              } as userData,
            })

            user.id = newUser.id.toString()
            user.isValid = false
            user.role = newUser.role
          } else {
            user.id = existingUser.id.toString()
            user.isValid = existingUser.isValid
            user.role = existingUser.role
          }
          return true
        } catch (error) {
          console.error("Error creating Google user:", error)
          return false
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
}
