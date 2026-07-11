import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Resend from 'next-auth/providers/resend'
import { authConfig } from '../auth.config'
import { db } from './db'
import { writeAuditLog } from './access'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  providers: [
    Resend({
      from: process.env.RESEND_FROM!,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`\n[dev] magic sign-in link for ${email}:\n${url}\n`)
        }
        const { Resend: ResendClient } = await import('resend')
        const resend = new ResendClient(process.env.RESEND_API_KEY!)
        try {
          const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM!,
            to: email,
            subject: 'Sign in to Tuition One',
            html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
              <h2 style="color:#1B2A24;margin-bottom:8px;">Sign in to Tuition One</h2>
              <p style="color:rgba(27,42,36,0.72);margin-bottom:24px;">
                Click the button below to sign in. This link expires in 24 hours and can only be used once.
              </p>
              <a href="${url}" style="display:inline-block;background:#E58F3F;color:white;font-weight:600;padding:14px 28px;border-radius:12px;text-decoration:none;">
                Sign in to Tuition One
              </a>
              <p style="color:rgba(27,42,36,0.52);font-size:13px;margin-top:24px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
          })
          if (error) throw new Error(`Resend: ${error.message}`)
        } catch (err) {
          // In dev the link is logged above, so don't block sign-in if email send fails.
          if (process.env.NODE_ENV !== 'development') throw err
          console.error('[dev] Resend send failed (ignored):', err)
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      const dbUser = await db.user.findUnique({
        where: { email: user.email },
        include: { purchases: { where: { status: 'COMPLETED' }, take: 1 } },
      })
      if (!dbUser || dbUser.deletedAt) return false
      const allowed = dbUser.role === 'ADMIN' || dbUser.purchases.length > 0
      if (allowed) await writeAuditLog(dbUser.id, 'login', 'User', dbUser.id, 'unknown')
      return allowed
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id   = user.id
        const dbUser = await db.user.findUnique({ where: { id: user.id }, select: { role: true } })
        token.role = dbUser?.role ?? 'STUDENT'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id   as string
        session.user.role = token.role as 'STUDENT' | 'ADMIN'
      }
      return session
    },
  },
})
