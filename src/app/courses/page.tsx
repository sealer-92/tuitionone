import { Section }    from '@/components/Section'
import { CourseList } from '@/components/CourseList'
import { getActiveCourses } from '@/lib/catalog'

export const metadata = {
  title: 'Courses — Tuition One Grinds',
  description: 'Browse all Saturday grinds: Higher Maths, Ordinary Maths, Higher Chemistry, Biology and Junior Cycle courses in Portlaoise.',
}

export default async function CoursesPage() {
  const courses = await getActiveCourses()
  return (
    <Section
      eyebrow="Spring 2026 catalogue"
      title="All courses"
      subtitle="Filter by year group or subject — every course runs Saturdays at our Portlaoise centre."
    >
      <CourseList courses={courses} />
    </Section>
  )
}
