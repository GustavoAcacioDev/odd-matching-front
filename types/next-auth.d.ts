import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string
      expiresIn: number
      expiresInDate: Date
    }

    error?: string
  }

  interface User {
    accessToken: string
    expiresIn: number
    expiresInDate: Date
    id?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    expiresIn: number
    expiresInDate: Date
    id?: number
  }
}
