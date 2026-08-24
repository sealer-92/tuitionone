import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SessionTimeout } from '@/components/SessionTimeout'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { auth } from '@/lib/auth'

// Variable fonts: omit `weight` to load the full range; `axes` adds extra axes.
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tuition One — Online Exam Prep for Leaving Cert & Junior Cycle',
  description:
    'Online video courses for Leaving Cert and Junior Cycle Maths. Learn at your own pace, from €150.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {session?.user && <SessionTimeout />}
        <AnalyticsTracker />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
