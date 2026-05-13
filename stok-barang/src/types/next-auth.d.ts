import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: string
    username: string
  }
  interface Session {
    user: {
      id: string
      name: string
      role: string
      username: string
    }
  }
}