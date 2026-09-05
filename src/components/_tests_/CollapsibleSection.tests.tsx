// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CollapsibleSection } from '@/components/CollapsibleSection'

function renderSection() {
  return render(
    <CollapsibleSection title="Booklets" icon={<span />} meta="2 booklets">
      <p>Chapter one</p>
    </CollapsibleSection>,
  )
}

describe('CollapsibleSection', () => {
  it('starts collapsed, hiding its children', () => {
    renderSection()
    expect(screen.getByRole('button', { name: /booklets/i }).getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByText('Chapter one')).toBeNull()
  })

  it('reveals its children when expanded, and hides them again', async () => {
    const user = userEvent.setup()
    renderSection()
    const toggle = screen.getByRole('button', { name: /booklets/i })

    await user.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('Chapter one')).toBeDefined()

    await user.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByText('Chapter one')).toBeNull()
  })
})
