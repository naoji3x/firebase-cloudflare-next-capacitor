import { env } from '@/env.mjs'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  secret: env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
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
})
