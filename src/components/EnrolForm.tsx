'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, ArrowRight, Lock } from 'lucide-react'
import { Course, COURSES } from '@/lib/courses'
import { Button } from './Button'

interface FormData {
  parentName:  string
  parentEmail: string
  parentPhone: string
  studentName: string
  courseId:    string
  terms:       boolean
}

export function EnrolForm() {
  const params = useSearchParams()
  const initialCourseId = params.get('course') ?? ''

  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>({
    parentName:  '',
    parentEmail: '',
    parentPhone: '',
    studentName: '',
    courseId:    initialCourseId,
    terms:       false,
  })
  const [confirmed, setConfirmed] = useState(false)

  const upd = <K extends keyof FormData>(k: K, v: FormData[K]) => setData((d) => ({ ...d, [k]: v }))

  const selectedCourse = COURSES.find((c) => c.id === data.courseId)
  const available      = COURSES.filter((c) => c.status !== 'waitlist')

  const fieldStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: 15, padding: '12px 14px',
    background: 'white', border: '1px solid var(--border-strong)', borderRadius: 8,
    color: 'var(--ink)', width: '100%', boxSizing: 'border-box', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
    color: 'var(--fg-2)', letterSpacing: '0.02em', marginBottom: 6, display: 'block',
  }

  function StepIndicator({ n, label }: { n: number; label: string }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: step >= n ? 'var(--orange)' : 'var(--cream)',
          color: step >= n ? 'white' : 'var(--fg-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13,
          border: step >= n ? '0' : '1px solid var(--border)',
        }}>
          {step > n ? <Check size={14} /> : n}
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: step === n ? 600 : 500, color: step >= n ? 'var(--ink)' : 'var(--fg-3)' }}>{label}</div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 20, padding: 48, textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(92,138,78,0.18)', color: 'var(--leaf-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={32} strokeWidth={2} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>Place reserved.</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--fg-2)', marginTop: 14, maxWidth: 460, margin: '14px auto 0' }}>
          We&apos;ve sent a confirmation to <b style={{ color: 'var(--ink)' }}>{data.parentEmail || 'your email'}</b>. The payment link follows in a separate message — you&apos;ve got 48 hours to complete it.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
          <Button variant="secondary" href="/">Back to home</Button>
          <Button variant="primary" href="/courses">See other courses</Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--paper)', borderRadius: 20, padding: '32px 36px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
      {/* Progress indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <StepIndicator n={1} label="Your details" />
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <StepIndicator n={2} label="Choose course" />
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <StepIndicator n={3} label="Confirm" />
      </div>

      {step === 1 && (
        <div style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>Tell us about you</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-2)', margin: '-6px 0 6px' }}>
            We&apos;ll email a confirmation and a payment link once your place is held.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <label>
              <span style={labelStyle}>Parent&apos;s name</span>
              <input style={fieldStyle} value={data.parentName} onChange={(e) => upd('parentName', e.target.value)} />
            </label>
            <label>
              <span style={labelStyle}>Student&apos;s name</span>
              <input style={fieldStyle} value={data.studentName} onChange={(e) => upd('studentName', e.target.value)} />
            </label>
            <label>
              <span style={labelStyle}>Email</span>
              <input type="email" style={fieldStyle} value={data.parentEmail} onChange={(e) => upd('parentEmail', e.target.value)} placeholder="aoife@example.com" />
            </label>
            <label>
              <span style={labelStyle}>Phone</span>
              <input style={fieldStyle} value={data.parentPhone} onChange={(e) => upd('parentPhone', e.target.value)} placeholder="087 ..." />
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <Button variant="primary" size="lg" onClick={() => setStep(2)} icon={<ArrowRight size={16} />}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'grid', gap: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>Choose a course</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-2)', margin: '-6px 0 0' }}>
            Pick the year-group and subject your child is enrolling for.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            {available.map((c) => {
              const on = data.courseId === c.id
              return (
                <button key={c.id} onClick={() => upd('courseId', c.id)} style={{
                  textAlign: 'left', padding: '16px 18px', borderRadius: 12,
                  border: on ? '2px solid var(--orange)' : '1px solid var(--border)',
                  background: on ? 'rgba(229,143,63,0.06)' : 'white',
                  cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center',
                  transition: 'all 120ms ease', fontFamily: 'inherit',
                }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange-deep)', marginBottom: 4 }}>
                      {c.weeks}-week · {c.subject}
                    </div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{c.title}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>{c.year} · {c.time}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>€{c.price}</div>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: on ? '0' : '1.5px solid var(--border-strong)', background: on ? 'var(--orange)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {on && <Check size={14} color="white" />}
                  </div>
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
            <Button variant="primary" size="lg" onClick={() => setStep(3)} icon={<ArrowRight size={16} />} disabled={!data.courseId}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'grid', gap: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>Confirm &amp; secure</h2>
          <div style={{ background: 'var(--cream)', borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange-deep)' }}>Booking summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 24px', marginTop: 14, fontFamily: 'var(--font-body)', fontSize: 15 }}>
              <div style={{ color: 'var(--fg-3)' }}>Student</div>
              <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{data.studentName || '—'}</div>
              <div style={{ color: 'var(--fg-3)' }}>Course</div>
              <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{selectedCourse ? `${selectedCourse.title} · ${selectedCourse.year}` : '—'}</div>
              <div style={{ color: 'var(--fg-3)' }}>Schedule</div>
              <div style={{ color: 'var(--ink)' }}>{selectedCourse ? `${selectedCourse.day} · ${selectedCourse.time}` : '—'}</div>
              <div style={{ color: 'var(--fg-3)' }}>Full course fee</div>
              <div style={{ color: 'var(--ink)', fontWeight: 700 }}>€{selectedCourse?.price ?? '—'}</div>
              <div style={{ color: 'var(--fg-3)' }}>Deposit due today</div>
              <div style={{ fontFamily: 'var(--font-ui)', color: 'var(--orange-deep)', fontWeight: 800, fontSize: 18 }}>€50</div>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', cursor: 'pointer' }}>
            <input type="checkbox" checked={data.terms} onChange={(e) => upd('terms', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--orange)', marginTop: 2, cursor: 'pointer' }} />
            <span>I&apos;ve read the terms — full payment is due by the course start date, and late payments forfeit the deposit.</span>
          </label>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
            <Button variant="primary" size="lg" onClick={() => setConfirmed(true)} icon={<Lock size={16} />} disabled={!data.terms}>Pay €50 deposit</Button>
          </div>
        </div>
      )}
    </div>
  )
}
