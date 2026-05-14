import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          !credentials?.username ||
          !credentials?.password
        ) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        })

        if (!user) {
          return null
        }

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!validPassword) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id      // tambah ini
      token.role = user.role
      token.username = user.username
    }
    return token
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id        // tambah ini
      session.user.role = token.role
      session.user.username = token.username
    }
    return session
  },
},
}