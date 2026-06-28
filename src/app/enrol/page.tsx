import { Suspense }   from 'react'
import { Section }    from '@/components/Section'
import { EnrolForm }  from '@/components/EnrolForm'
import { getActiveCourses } from '@/lib/catalog'

export const metadata = {
  title: 'Enrol — Tuition One Grinds',
  description: 'Reserve a place on a Saturday grinds course. Choose videos, digital or printed booklets — pay securely online.',
}

export default async function EnrolPage() {
  const courses = await getActiveCourses()
  return (
    <Section
      narrow
      eyebrow="Reserve a place"
      title="Enrol your child"
      subtitle="Three short steps. Choose the course and the option that suits you."
    >
      <Suspense>
        <EnrolForm courses={courses} />
      </Suspense>
    </Section>
  )
}
