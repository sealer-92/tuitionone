import { Hero }         from '@/components/Hero'
import { Section }      from '@/components/Section'
import { ValueProps }   from '@/components/ValueProps'
import { CourseList }   from '@/components/CourseList'
import { Testimonial }  from '@/components/Testimonial'
import { ContactBlock } from '@/components/ContactBlock'
import { Button }       from '@/components/Button'
import { getActiveCourses } from '@/lib/catalog'

export default async function HomePage() {
  const courses = await getActiveCourses()
  return (
    <>
      <Hero />

      <Section
        eyebrow="Why parents pick us"
        title="A small classroom that does the boring work for you."
        subtitle="No marketing fluff — just the things that move a Leaving Cert grade."
      >
        <ValueProps />
      </Section>

      <Section
        style={{ background: 'var(--cream)' }}
        eyebrow="Now enrolling"
        title="Spring 2026 courses"
        subtitle="Saturdays at our Portlaoise centre. A €50 deposit secures the place."
      >
        <CourseList courses={courses.slice(0, 4)} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Button variant="secondary" size="lg" href="/courses">See all courses →</Button>
        </div>
      </Section>

      <Section narrow>
        <Testimonial />
      </Section>

      <Section
        dark
        eyebrow="Get in touch"
        title="Have a question? We answer everything."
        subtitle="The fastest way to ask anything is a quick WhatsApp."
      >
        <ContactBlock dark />
      </Section>
    </>
  )
}
