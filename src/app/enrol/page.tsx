import { Suspense }   from 'react'
import { Section }    from '@/components/Section'
import { EnrolForm }  from '@/components/EnrolForm'

export const metadata = {
  title: 'Enrol — Tuition One Grinds',
  description: 'Reserve a place on a Saturday grinds course. Three short steps — pay in full to unlock all notes and videos.',
}

export default function EnrolPage() {
  return (
    <Section
      narrow
      eyebrow="Reserve a place"
      title="Enrol your child"
      subtitle="Three short steps. One payment unlocks all course notes and videos."
    >
      <Suspense>
        <EnrolForm />
      </Suspense>
    </Section>
  )
}
