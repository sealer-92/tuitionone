import type { NextAuthConfig } from 'next-auth'

// Edge-compatible config — no Prisma imports, used by proxy and auth.ts
export const authConfig = {
  pages: {
    signIn:        '/auth/signin',
    verifyRequest: '/auth/verify',
    error:         '/auth/error',
  },
  cookies: {
    sessionToken: {
      name: 'tuition-session',
      options: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' },
    },
  },
  providers: [], // populated in auth.ts
  callbacks: {
    // Surface the role from the JWT so the middleware (which uses this config alone)
    // can authorise /admin. The role is written to the token in auth.ts at sign-in.
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string | undefined
      return session
    },
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
