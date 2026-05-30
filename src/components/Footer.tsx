import Image from 'next/image'
import Link from 'next/link'
import { Mail, AtSign, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{ background: 'var(--chalkboard-deep)', color: 'var(--chalk)', padding: '56px var(--container-pad) 28px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/tuition-one-logo.png" alt="Tuition One" width={38} height={38} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 16, letterSpacing: '0.06em' }}>
              TUITION ONE
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--leaf)', letterSpacing: '0.22em' }}>GRINDS</div>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(245,239,228,0.65)', marginTop: 20, maxWidth: 320, lineHeight: 1.55 }}>
            Saturday grinds in Maths, Chemistry and Science for secondary-school students across the midlands.
          </p>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 14 }}>Courses</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Higher Maths', 'Ordinary Maths', 'Higher Chemistry', 'Junior Cycle'].map((l) => (
              <li key={l}>
                <Link href="/courses" style={{ color: 'rgba(245,239,228,0.75)', fontFamily: 'var(--font-body)', fontSize: 14, textDecoration: 'none' }}>{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 14 }}>Visit</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(245,239,228,0.75)', margin: 0, lineHeight: 1.55 }}>
            Vision 85<br />Clonminam Business Park<br />Portlaoise · R32 F5T6<br /><br />Saturdays 08:00–16:00
          </p>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 14 }}>Contact</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(245,239,228,0.75)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} />tuitiononegrinds@gmail.com</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AtSign size={14} />@tuition_one</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MessageCircle size={14} />087 069 2287</li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(245,239,228,0.5)' }}>
        <div>© 2026 Tuition One Grinds</div>
        <div>Terms · Privacy · Refunds</div>
      </div>
    </footer>
  )
}
