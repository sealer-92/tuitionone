import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SessionTimeout } from '@/components/SessionTimeout'
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
    'Online video courses and study notes for Leaving Cert and Junior Cycle Maths, Chemistry, Biology and Science. Learn at your own pace, from €150.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {session?.user && <SessionTimeout />}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
