import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string      // tambah ini
      role: string
      username: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string        // tambah ini juga
    role: string
    username: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string        // tambah ini juga
    role: string
    username: string
  }
}