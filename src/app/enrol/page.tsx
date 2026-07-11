import { Suspense }   from 'react'
import { Section }    from '@/components/Section'
import { EnrolForm }  from '@/components/EnrolForm'
import { getActiveCourses } from '@/lib/catalog'

export const metadata = {
  title: 'Enrol — Tuition One',
  description: 'Get instant access to an online course. Choose videos with a digital or printed booklet — pay securely online.',
}

export default async function EnrolPage() {
  const courses = await getActiveCourses()
  return (
    <Section
      narrow
      eyebrow="Get started"
      title="Enrol online"
      subtitle="Three short steps. Choose the course and the option that suits you, and get instant access."
    >
      <Suspense>
        <EnrolForm courses={courses} />
      </Suspense>
    </Section>
  )
}
