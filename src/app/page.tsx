import { Hero }          from '@/components/Hero'
import { Section }       from '@/components/Section'
import { ValueProps }    from '@/components/ValueProps'
import { AudienceCards } from '@/components/AudienceCards'
import { CourseList }    from '@/components/CourseList'
import { Testimonial }   from '@/components/Testimonial'
import { CtaBand }       from '@/components/CtaBand'
import { ContactBlock }  from '@/components/ContactBlock'
import { Sparkles, PlayCircle, Quote, MessageCircle } from 'lucide-react'
import { getActiveCourses } from '@/lib/catalog'

export default async function HomePage() {
  const courses = await getActiveCourses()
  return (
    <>
      <Hero />

      <Section
        center
        eyebrow="Why parents choose us"
        eyebrowIcon={<Sparkles size={16} />}
        title="Learn from someone who knows the exam from both sides"
        subtitle="Choosing the right teacher makes all the difference — over ten years in the classroom, and inside the State exams."
      >
        <ValueProps />
      </Section>

      <Section
        style={{ background: 'var(--cream)' }}
        center
        eyebrow="How it works"
        eyebrowIcon={<PlayCircle size={16} />}
        title="Learn by watching every step"
        subtitle="Like having a personal tutor whenever you need one — pause, rewind and revisit until it clicks."
      >
        <AudienceCards />
      </Section>

      <Section
        eyebrow="Courses & notes"
        title="Full courses and study notes"
        subtitle="Video courses in Leaving Cert Maths (Higher & Ordinary), Leaving Cert Chemistry and Junior Cycle Maths — plus study notes for Leaving Cert Biology and Junior Cycle Science. From €150 with a digital or printed booklet."
      >
        <CourseList courses={courses} />
      </Section>

      <Section
        style={{ background: 'var(--cream)' }}
        center
        eyebrow="Kind words"
        eyebrowIcon={<Quote size={16} />}
        title="Results that speak for themselves"
        subtitle="Don’t just take our word for it — here’s what students and their parents tell us."
      >
        <Testimonial />
      </Section>

      <Section
        center
        eyebrow="Get in touch"
        eyebrowIcon={<MessageCircle size={16} />}
        title="Have a question? We’re happy to help"
        subtitle="The fastest way to ask anything is a quick message."
      >
        <ContactBlock />
      </Section>

      <CtaBand />
    </>
  )
}
