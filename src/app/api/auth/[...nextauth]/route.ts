import NextAuth, { AuthOptions } from "next-auth"
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
        });

        if (!user || !user.password) return null; // Check if password exists

        const valid = await compare(credentials!.password, user.password);
        if (!valid) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          isValid: user.isValid,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // ✅ JWT Strategy
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      if(account && account.provider === "google"){
        token.accessToken = account.access_token
      }
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.isValid = user.isValid
      } else if (trigger === "update" && session?.user) {
        // Handle session update
        if (session.user.isValid !== undefined) {
          token.isValid = session.user.isValid;
        }
      } else if (token.email && (token.isValid === undefined || token.id === undefined)) {
        // Refresh user data from database for existing sessions
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, isValid: true, name: true }
        });
        if (dbUser) {
          token.id = dbUser.id.toString();
          token.isValid = dbUser.isValid;
          token.name = dbUser.name;
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.isValid = token.isValid as boolean
      }
      return session
    },
    async signIn({ user, account}) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
              where: { email: user.email! },
            });

          if (!existingUser) {
            const userData: userData = {
              name: user.name!,
              email: user.email!,
              password: "", // Explicitly set empty string for Google users
              isValid: false, // Set default isValid to false for new Google users
            };
            
            const newUser = await prisma.user.create({
              data: userData,
            });
            
            user.id = newUser.id.toString();
            user.isValid = false;
          } else {
            // Set database ID and isValid from existing user
            user.id = existingUser.id.toString();
            user.isValid = existingUser.isValid;
          }
          return true;
        } catch (error) {
          console.error("Error creating Google user:", error);
          return false;
        }
      }
      return true; // Allow sign in for credentials provider
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login", // Redirect to login page after logout
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
