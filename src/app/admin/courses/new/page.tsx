import { CourseForm } from '@/components/admin/CourseForm'

export const metadata = { title: 'New course — Admin' }

export default function NewCoursePage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 24px' }}>New course</h1>
      <CourseForm />
    </div>
  )
}
