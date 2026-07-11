import { Section }    from '@/components/Section'
import { CourseList } from '@/components/CourseList'
import { getActiveCourses } from '@/lib/catalog'

export const metadata = {
  title: 'Courses — Tuition One',
  description: 'Browse online video courses and study notes: Higher & Ordinary Maths, Chemistry, Biology and Junior Cycle Maths & Science.',
}

export default async function CoursesPage() {
  const courses = await getActiveCourses()
  return (
    <Section
      eyebrow="Courses & notes"
      title="All courses"
      subtitle="Filter by year group or subject — every course is online and self-paced, with a digital or printed booklet."
    >
      <CourseList courses={courses} />
    </Section>
  )
}
