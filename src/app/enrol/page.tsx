import { Suspense }   from 'react'
import { Section }    from '@/components/Section'
import { EnrolForm }  from '@/components/EnrolForm'

export const metadata = {
  title: 'Enrol — Tuition One Grinds',
  description: 'Reserve a place on a Saturday grinds course. Three short steps — a €50 deposit holds your child\'s place.',
}

export default function EnrolPage() {
  return (
    <Section
      narrow
      eyebrow="Reserve a place"
      title="Enrol your child"
      subtitle="Three short steps. A €50 deposit holds the place — the rest is due before the course starts."
    >
      <Suspense>
        <EnrolForm />
      </Suspense>
    </Section>
  )
}
