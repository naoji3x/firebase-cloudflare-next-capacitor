import { env } from '@/env.mjs'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID!,
      clientSecret: env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },

  jwt: {
    secret: env.NEXTAUTH_SECRET
  },
  pages: {},
  callbacks: {
    async jwt({ token, account }) {
      return { ...token, ...account }
    },
    async session({ session, token }) {
      session.user.id_token = token.id_token
      return session
    }
  },
  debug: process.env.NODE_ENV !== 'production'
}

export default NextAuth(authOptions)
