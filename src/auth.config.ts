import type { NextAuthConfig } from 'next-auth'

// Edge-compatible config — no Prisma imports, used by middleware
export const authConfig = {
  pages: {
    signIn:        '/auth/signin',
    verifyRequest: '/auth/verify',
    error:         '/auth/error',
  },
  providers: [], // populated in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdmin    = (auth?.user as { role?: string })?.role === 'ADMIN'
      const path       = nextUrl.pathname

      if (path.startsWith('/admin')) {
        if (!isLoggedIn) return Response.redirect(new URL('/auth/signin?callbackUrl=/admin', nextUrl))
        if (!isAdmin)    return Response.redirect(new URL('/', nextUrl))
        return true
      }

      if (path.startsWith('/dashboard') || path.startsWith('/api/content')) {
        if (!isLoggedIn) return Response.redirect(new URL('/auth/signin', nextUrl))
        return true
      }

      return true
    },
  },
} satisfies NextAuthConfig
