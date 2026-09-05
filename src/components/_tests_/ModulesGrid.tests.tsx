// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModulesGrid, ModulePurchase } from '@/components/ModulesGrid'

function purchase(overrides: Partial<ModulePurchase['course']> & { id: string }): ModulePurchase {
  const { id, ...course } = overrides
  return {
    id,
    option: 'FULL',
    course: {
      id: `course-${id}`,
      slug: 'hl-maths',
      title: 'Higher Level Maths',
      subject: 'Maths',
      year: '5th & 6th Year',
      weeks: 20,
      schedule: 'Saturday 13:00–14:00',
      modules: [
        { id: 'm1', _count: { contentItems: 2 } },
      ],
      booklets: [{ id: 'b1' }],
      ...course,
    },
  }
}

const seniorMaths = purchase({ id: 'p1' })
const juniorScience = purchase({
  id: 'p2',
  slug: 'jc-science',
  title: 'Junior Cycle Science',
  subject: 'Science',
  year: '3rd Year',
  modules: [
    { id: 'm2', _count: { contentItems: 1 } },
  ],
  booklets: [{ id: 'b2' }, { id: 'b3' }],
})

describe('ModulesGrid', () => {
  it('renders a card per purchase with title, code and counts', () => {
    render(<ModulesGrid purchases={[seniorMaths, juniorScience]} />)

    expect(screen.getByText('Higher Level Maths')).toBeDefined()
    expect(screen.getByText('Junior Cycle Science')).toBeDefined()
    expect(screen.getByText('HL_MATHS')).toBeDefined()
    expect(screen.getByText('2 videos')).toBeDefined()
  })

  it('shows a booklets count for an online purchase', () => {
    render(<ModulesGrid purchases={[seniorMaths]} />)
    expect(screen.getByText('1 booklets')).toBeDefined()
  })

  it('shows no booklets count for a printed-only purchase', () => {
    render(<ModulesGrid purchases={[{ ...seniorMaths, option: 'PHYSICAL_BOOKLET' }]} />)
    expect(screen.queryByText('1 booklets')).toBeNull()
  })

  it('links each card to its course page', () => {
    render(<ModulesGrid purchases={[seniorMaths]} />)
    const link = screen.getByRole('link', { name: /higher level maths/i })
    expect(link.getAttribute('href')).toBe('/dashboard/course/course-p1')
  })

  it('filters cards by year group tab', async () => {
    const user = userEvent.setup()
    render(<ModulesGrid purchases={[seniorMaths, juniorScience]} />)

    await user.click(screen.getByRole('tab', { name: '3rd Year' }))
    expect(screen.queryByText('Higher Level Maths')).toBeNull()
    expect(screen.getByText('Junior Cycle Science')).toBeDefined()

    await user.click(screen.getByRole('tab', { name: 'All' }))
    expect(screen.getByText('Higher Level Maths')).toBeDefined()
  })

  it('hides the tabs when every course is in the same year group', () => {
    render(<ModulesGrid purchases={[seniorMaths]} />)
    expect(screen.queryByRole('tablist')).toBeNull()
  })

  it('shows the posted-only state for a physical booklet purchase', () => {
    render(<ModulesGrid purchases={[{ ...seniorMaths, option: 'PHYSICAL_BOOKLET' }]} />)
    expect(screen.getByText('Posted to you')).toBeDefined()
    expect(screen.queryByText('2 videos')).toBeNull()
  })
})
