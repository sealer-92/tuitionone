import { Section }       from '@/components/Section'
import { AboutSection }  from '@/components/AboutSection'
import { Testimonial }   from '@/components/Testimonial'
import { ContactBlock }  from '@/components/ContactBlock'

export const metadata = {
  title: 'About — Tuition One Grinds',
  description: 'Small class grinds the way they should be — focused, friendly, and effective. Learn about our approach, what\'s included, and who we are.',
}

export default function AboutPage() {
  return (
    <>
      <Section
        eyebrow="About Tuition One"
        title="Grinds the way they should be — small, focused and friendly."
      >
        <AboutSection />
      </Section>

      <Section style={{ background: 'var(--cream)' }} narrow>
        <Testimonial />
      </Section>

      <Section dark eyebrow="Get in touch" title="Come and see the classroom.">
        <ContactBlock dark />
      </Section>
    </>
  )
}
