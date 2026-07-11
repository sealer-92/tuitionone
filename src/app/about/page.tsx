import { Section }       from '@/components/Section'
import { AboutSection }  from '@/components/AboutSection'
import { Testimonial }   from '@/components/Testimonial'
import { ContactBlock }  from '@/components/ContactBlock'

export const metadata = {
  title: 'About — Tuition One',
  description: 'Online exam preparation built by an experienced teacher and State exams corrector. Learn about the approach, what\'s included, and who we are.',
}

export default function AboutPage() {
  return (
    <>
      <Section
        eyebrow="About Tuition One"
        title="Exam preparation, built by someone who knows the exam from both sides."
      >
        <AboutSection />
      </Section>

      <Section style={{ background: 'var(--cream)' }} narrow>
        <Testimonial />
      </Section>

      <Section dark eyebrow="Get in touch" title="Have a question? We’re happy to help.">
        <ContactBlock dark />
      </Section>
    </>
  )
}
