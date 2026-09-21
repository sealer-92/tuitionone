// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EnrolForm } from '@/components/EnrolForm'
import { Course } from '@/lib/courses'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

const courses: Course[] = [
  {
    id: 'hl-maths',
    slug: 'hl-maths',
    title: 'Higher Level Maths',
    subject: 'Maths',
    year: '5th & 6th Year',
    format: 'VIDEO_AND_BOOKLET',
    fullPriceCents: 15000,
    fullPhysicalPriceCents: 20000,
    digitalBookletPriceCents: null,
    physicalBookletPriceCents: null,
    status: 'ACTIVE',
    weeks: 20,
    schedule: 'Saturday 13:00–14:00',
  },
]

// Fills everything except the email pair, which each test drives itself.
async function fillDetails(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Parent's first name"), 'Aoife')
  await user.type(screen.getByLabelText("Parent's last name"), 'Murphy')
  await user.type(screen.getByLabelText("Student's first name"), 'Sean')
  await user.type(screen.getByLabelText("Student's last name"), 'Murphy')
  await user.type(screen.getByLabelText('Phone'), '0871234567')
  await user.type(screen.getByLabelText('Address line 1'), '1 Main Street')
  await user.type(screen.getByLabelText('Town / City'), 'Carlow')
  await user.selectOptions(screen.getByLabelText('County'), 'Carlow')
  await user.type(screen.getByLabelText('Eircode'), 'R93A1B2')
}

describe('EnrolForm — email confirmation', () => {
  it('explains that the email is the one used to sign in', () => {
    render(<EnrolForm courses={courses} />)
    expect(
      screen.getByText(/person who will be watching the videos and reading the notes/i),
    ).toBeTruthy()
  })

  it('blocks Continue and shows an error when the addresses differ', async () => {
    const user = userEvent.setup()
    render(<EnrolForm courses={courses} />)
    await fillDetails(user)
    await user.type(screen.getByLabelText('Email'), 'aoife@example.com')
    await user.type(screen.getByLabelText('Confirm email'), 'aoife@exmaple.com')

    expect(screen.getByText(/don't match/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /continue/i }).hasAttribute('disabled')).toBe(true)
  })

  it('blocks Continue while the confirmation is still empty', async () => {
    const user = userEvent.setup()
    render(<EnrolForm courses={courses} />)
    await fillDetails(user)
    await user.type(screen.getByLabelText('Email'), 'aoife@example.com')

    expect(screen.getByRole('button', { name: /continue/i }).hasAttribute('disabled')).toBe(true)
  })

  it('allows Continue once the addresses match, ignoring case and spacing', async () => {
    const user = userEvent.setup()
    render(<EnrolForm courses={courses} />)
    await fillDetails(user)
    await user.type(screen.getByLabelText('Email'), 'aoife@example.com')
    await user.type(screen.getByLabelText('Confirm email'), ' Aoife@Example.com ')

    expect(screen.queryByText(/don't match/i)).toBeNull()
    expect(screen.getByRole('button', { name: /continue/i }).hasAttribute('disabled')).toBe(false)
  })
})
