import { Section }    from '@/components/Section'
import { CourseList } from '@/components/CourseList'
import { COURSES }    from '@/lib/courses'

export const metadata = {
  title: 'Courses — Tuition One Grinds',
  description: 'Browse all Saturday grinds: Higher Maths, Ordinary Maths, Higher Chemistry, Ordinary Chemistry and Junior Cycle courses in Portlaoise.',
}

export default function CoursesPage() {
  return (
    <Section
      eyebrow="Spring 2026 catalogue"
      title="All courses"
      subtitle="Filter by year group or subject — every course runs Saturdays at our Portlaoise centre."
    >
      <CourseList courses={COURSES} />
    </Section>
  )
}
