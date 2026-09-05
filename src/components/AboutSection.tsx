import Image from 'next/image'
import { PlayCircle, BookOpen, FileCheck, Repeat } from 'lucide-react'

const included = [
  { icon: <PlayCircle size={18} />, title: 'Full video course',       body: 'Every topic broken into clear lessons you can watch anytime.' },
  { icon: <BookOpen size={18} />,   title: 'Course booklet',          body: 'A matching booklet — digital, or printed and posted to you.' },
  { icon: <FileCheck size={18} />,  title: 'Exam walkthroughs',       body: 'Worked solutions to past exam questions, explained step by step.' },
  { icon: <Repeat size={18} />,     title: 'Learn at your own pace',  body: 'Pause, rewind and revisit lessons as often as you need.' },
]

export function AboutSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 56, alignItems: 'center' }}>
      <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden', background: 'var(--sage-tan-soft)' }}>
        <Image
          src="/about-classroom.png"
          alt="A teacher writing algebra and trigonometry on a classroom blackboard"
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 14 }}>What&apos;s included</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 38px)', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>
          A real teacher.<br />Every step on video.<br />A plan for the exam.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--fg-2)', marginTop: 20 }}>
          Every topic is broken into clear video lessons with a booklet that matches — so you learn the method, watch it worked through, then practise it at your own pace.
        </p>
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18 }}>
          {included.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(229,143,63,0.14)', color: 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {it.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{it.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', marginTop: 2, lineHeight: 1.45 }}>{it.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
