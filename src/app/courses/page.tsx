import { Section }    from '@/components/Section'
import { CourseList } from '@/components/CourseList'
import { getCatalogCourses } from '@/lib/catalog'

export const metadata = {
  title: 'Courses — Tuition One',
  description: 'Browse online video courses: Higher & Ordinary Level Maths and Junior Cycle Maths. Chemistry, Biology and Science coming soon.',
}

export default async function CoursesPage() {
  const courses = await getCatalogCourses()
  return (
    <Section
      eyebrow="Courses"
      title="All courses"
      subtitle="Filter by year group or subject — every course is online and self-paced. Chemistry, Biology and Science are coming soon."
    >
      <CourseList courses={courses} />
    </Section>
  )
}
