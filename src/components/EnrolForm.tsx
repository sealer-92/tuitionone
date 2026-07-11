'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, ArrowRight, Lock } from 'lucide-react'
import { Course } from '@/lib/courses'
import { optionsForCourse, needsShipping, isValidEircode, IRISH_COUNTIES } from '@/lib/options'
import { PurchaseOption } from '@prisma/client'
import { Button } from './Button'

function StepIndicator({ step, n, label }: { step: number; n: number; label: string }) {
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

interface FormData {
  parentName:  string
  parentEmail: string
  parentPhone: string
  studentName: string
  line1:       string
  line2:       string
  city:        string
  county:      string
  eircode:     string
  courseId:    string
  option:      PurchaseOption | ''
  terms:       boolean
}

export function EnrolForm({ courses }: { courses: Course[] }) {
  const params = useSearchParams()
  const initialCourseId = params.get('course') ?? ''

  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>({
    parentName:  '',
    parentEmail: '',
    parentPhone: '',
    studentName: '',
    line1:       '',
    line2:       '',
    city:        '',
    county:      '',
    eircode:     '',
    courseId:    courses.some((c) => c.id === initialCourseId) ? initialCourseId : '',
    option:      '',
    terms:       false,
  })
  const [loading, setLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const upd = <K extends keyof FormData>(k: K, v: FormData[K]) => setData((d) => ({ ...d, [k]: v }))

  const selectedCourse = courses.find((c) => c.id === data.courseId)
  const options        = selectedCourse ? optionsForCourse(selectedCourse) : []
  const selectedOption = options.find((o) => o.option === data.option)

  const eircodeValid = isValidEircode(data.eircode)
  const detailsValid =
    data.parentName && data.studentName && data.parentEmail && data.parentPhone &&
    data.line1 && data.city && data.county && eircodeValid

  async function handleCheckout() {
    setLoading(true)
    setCheckoutError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId:    data.courseId,
          option:      data.option,
          parentName:  data.parentName,
          parentEmail: data.parentEmail,
          parentPhone: data.parentPhone,
          studentName: data.studentName,
          line1:       data.line1,
          line2:       data.line2,
          city:        data.city,
          county:      data.county,
          eircode:     data.eircode,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setCheckoutError(json.error ?? 'Something went wrong. Please try again.')
        return
      }
      window.location.href = json.url
    } catch {
      setCheckoutError('Could not reach the payment provider. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: 15, padding: '12px 14px',
    background: 'white', border: '1px solid var(--border-strong)', borderRadius: 8,
    color: 'var(--ink)', width: '100%', boxSizing: 'border-box', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
    color: 'var(--fg-2)', letterSpacing: '0.02em', marginBottom: 6, display: 'block',
  }

  return (
    <div style={{ background: 'var(--paper)', borderRadius: 20, padding: 'clamp(20px, 4vw, 36px)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
      {/* Progress indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <StepIndicator step={step} n={1} label="Your details" />
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <StepIndicator step={step} n={2} label="Course & option" />
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <StepIndicator step={step} n={3} label="Confirm" />
      </div>

      {step === 1 && (
        <div style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>Tell us about you</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-2)', margin: '-6px 0 6px' }}>
            We&apos;ll email your sign-in link once payment is complete. A delivery address is required for posting printed booklets.
          </p>
          <div className="enrol-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
            <label style={{ gridColumn: '1 / -1' }}>
              <span style={labelStyle}>Address line 1</span>
              <input style={fieldStyle} value={data.line1} onChange={(e) => upd('line1', e.target.value)} placeholder="Street and number" />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <span style={labelStyle}>Address line 2 <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(optional)</span></span>
              <input style={fieldStyle} value={data.line2} onChange={(e) => upd('line2', e.target.value)} placeholder="Townland, area" />
            </label>
            <label>
              <span style={labelStyle}>Town / City</span>
              <input style={fieldStyle} value={data.city} onChange={(e) => upd('city', e.target.value)} />
            </label>
            <label>
              <span style={labelStyle}>County</span>
              <select style={{ ...fieldStyle, appearance: 'auto' }} value={data.county} onChange={(e) => upd('county', e.target.value)}>
                <option value="">Select county…</option>
                {IRISH_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <span style={labelStyle}>Eircode</span>
              <input
                style={{ ...fieldStyle, textTransform: 'uppercase', borderColor: data.eircode && !eircodeValid ? '#B5483C' : 'var(--border-strong)' }}
                value={data.eircode}
                onChange={(e) => upd('eircode', e.target.value)}
                placeholder="e.g. R93 A1B2"
                maxLength={8}
              />
              {data.eircode && !eircodeValid && (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#B5483C', marginTop: 4, display: 'block' }}>
                  Enter a valid 7-character Eircode.
                </span>
              )}
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep(2)}
              icon={<ArrowRight size={16} />}
              disabled={!detailsValid}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'grid', gap: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>Choose a course</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {courses.map((c) => {
              const on = data.courseId === c.id
              const from = optionsForCourse(c)
              const fromPrice = from.length ? Math.min(...from.map((o) => o.priceCents)) / 100 : null
              return (
                <button key={c.id} onClick={() => { upd('courseId', c.id); upd('option', '') }} style={{
                  textAlign: 'left', padding: '16px 18px', borderRadius: 12,
                  border: on ? '2px solid var(--orange)' : '1px solid var(--border)',
                  background: on ? 'rgba(229,143,63,0.06)' : 'white',
                  cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center',
                  transition: 'all 120ms ease', fontFamily: 'inherit',
                }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange-deep)', marginBottom: 4 }}>
                      {c.subject} · {c.format === 'VIDEO_AND_BOOKLET' ? 'Videos & booklets' : 'Booklets only'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{c.title}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>{c.year} · {c.schedule}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>{fromPrice != null ? `from €${fromPrice}` : '—'}</div>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: on ? '0' : '1.5px solid var(--border-strong)', background: on ? 'var(--orange)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {on && <Check size={14} color="white" />}
                  </div>
                </button>
              )
            })}
          </div>

          {selectedCourse && (
            <div style={{ display: 'grid', gap: 10 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, margin: '8px 0 0', color: 'var(--ink)' }}>Choose an option</h3>
              {options.map((o) => {
                const on = data.option === o.option
                return (
                  <button key={o.option} onClick={() => upd('option', o.option)} style={{
                    textAlign: 'left', padding: '14px 16px', borderRadius: 12,
                    border: on ? '2px solid var(--orange)' : '1px solid var(--border)',
                    background: on ? 'rgba(229,143,63,0.06)' : 'white',
                    cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14, alignItems: 'center',
                    transition: 'all 120ms ease', fontFamily: 'inherit',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{o.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>{o.description}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>€{o.priceCents / 100}</div>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', border: on ? '0' : '1.5px solid var(--border-strong)', background: on ? 'var(--orange)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {on && <Check size={14} color="white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
            <Button variant="primary" size="lg" onClick={() => setStep(3)} icon={<ArrowRight size={16} />} disabled={!data.courseId || !data.option}>Continue</Button>
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
              <div style={{ color: 'var(--fg-3)' }}>Option</div>
              <div style={{ color: 'var(--ink)' }}>{selectedOption?.label ?? '—'}</div>
              {selectedOption && needsShipping(selectedOption.option) && (
                <>
                  <div style={{ color: 'var(--fg-3)' }}>Posting to</div>
                  <div style={{ color: 'var(--ink)' }}>{[data.line1, data.line2, data.city, data.county, data.eircode].filter(Boolean).join(', ')}</div>
                </>
              )}
              <div style={{ color: 'var(--fg-3)' }}>Total due today</div>
              <div style={{ fontFamily: 'var(--font-ui)', color: 'var(--orange-deep)', fontWeight: 800, fontSize: 18 }}>{selectedOption ? `€${selectedOption.priceCents / 100}` : '—'}</div>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', cursor: 'pointer' }}>
            <input type="checkbox" checked={data.terms} onChange={(e) => upd('terms', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--orange)', marginTop: 2, cursor: 'pointer' }} />
            <span>I&apos;ve read the terms and agree to this purchase.</span>
          </label>
          {checkoutError && (
            <div style={{ background: 'rgba(181,72,60,0.08)', border: '1px solid rgba(181,72,60,0.25)', borderRadius: 10, padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: '#B5483C' }}>
              {checkoutError}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <Button variant="ghost" onClick={() => setStep(2)} disabled={loading}>← Back</Button>
            <Button variant="primary" size="lg" onClick={handleCheckout} icon={<Lock size={16} />} disabled={!data.terms || loading}>
              {loading ? 'Redirecting…' : `Pay €${selectedOption ? selectedOption.priceCents / 100 : ''}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
