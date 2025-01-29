import { loginServer } from '@/services/auth/login/login-server'
import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'Email / Usuário',
        },
        password: { label: 'Password', type: 'password', placeholder: 'Senha' },
      },

      async authorize(credentials) {
        if (
          !credentials?.username &&
          !credentials?.password
        )
          return null

        const reqBody = {
          username: credentials.username,
          password: credentials.password,
        }

        const res = await loginServer(reqBody)

        console.log(res)

        if (!res.isSuccess) {
          console.log('Authentication failed')
          throw new Error(res.errors[0])
        }

        const user = res.value

        if (user) {
          console.log('Authentication successful', user)
          return user
        } else {
          console.log('Authentication failed')
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user } as JWT

      return token
    },

    async session({ token, session }) {
      session.user = {
        accessToken: token.accessToken as string,
        expiresIn: token.expiresIn,
        expiresInDate: token.expiresInDate,
      }

      return session
    },
  },

  session: {
    maxAge: 60 * 60 * 16,
  },

  pages: {
    signIn: '/sign-in',
  },
}
