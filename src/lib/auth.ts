
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import connectDB from "./db"
import { Student } from "@/model/students"
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
        await connectDB();
        const user = await Student.findOne({ email: credentials?.email });
        console.log("Found user:", user); // Debugging line
        if (!user || !user.password) return null

        const valid = await user.comparePassword(credentials!.password);
        console.log("Password valid:", valid); // Debugging line
        if (!valid) return null

        return {
          id: user.id.toString(),
          name: user.full_name,
          email: user.email,
          role: user.role
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
    async jwt({ token, account, user}) {
      if (account?.provider === "google") {
        token.accessToken = account.access_token
      }
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      } 
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      console.log("Session callback - after assign:", session)
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB()
        try {
          // First try to find by googleId, then by email
          let existingUser = await Student.findOne({ googleId: account.providerAccountId })
          if (!existingUser) {
            existingUser = await Student.findOne({ email: user.email! })
          }
          
          if (existingUser) {
            if (!existingUser.googleId) {
              existingUser.googleId = account.providerAccountId
              await existingUser.save()
            }
            user.id = existingUser.id.toString()
            user.role = existingUser.role;
          } else {
            // Create new user
            const newUser = await Student.create({
                googleId: account.providerAccountId,
                full_name: user.name!,
                email: user.email!,
                avatar: user.image,
                password: account.providerAccountId, // google user -> use providerAccountId as password
                rank_now: 0, // Set default rank
            });

            user.id = newUser.id.toString()
            user.role = newUser.role;
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
