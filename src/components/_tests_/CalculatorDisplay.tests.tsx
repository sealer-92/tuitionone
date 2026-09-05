// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { CalculatorDisplay } from '@/components/CalculatorDisplay'

// jsdom has no matchMedia; each test installs one with the value it needs.
function mockReducedMotion(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

function display() {
  return screen.getByText((_, el) => el?.tagName.toLowerCase() === 'text')
}

function renderInSvg() {
  return render(
    <svg>
      <CalculatorDisplay fill="#5C8A4E" />
    </svg>,
  )
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('CalculatorDisplay', () => {
  it('types the digits in one at a time, then spells HELLO', () => {
    mockReducedMotion(false)
    renderInSvg()

    expect(display().textContent).toBe('4')

    const at = (ms: number) => { act(() => { vi.advanceTimersByTime(ms) }); return display().textContent }

    expect(at(120)).toBe('43')
    expect(at(120)).toBe('437')
    expect(at(120)).toBe('4377')
    expect(at(120)).toBe('43770')

    // the full number holds briefly, then the digits swap to letters in place
    expect(at(300)).toBe('H3770')
    expect(at(240)).toBe('HELLO')
  })

  it('flashes HELLO three times, then restarts the cycle', () => {
    mockReducedMotion(false)
    renderInSvg()

    const opacities: string[] = []
    // Walk one full cycle (30 frames x 60ms) sampling every frame.
    for (let i = 0; i < 30; i++) {
      act(() => { vi.advanceTimersByTime(60) })
      const el = display()
      if (el.textContent === 'HELLO') opacities.push(el.getAttribute('opacity') ?? '')
    }

    const dimmed = opacities.filter((o) => o === '0.12')
    expect(dimmed).toHaveLength(3)

    // One cycle is 1800ms, so the display is back to a single digit.
    expect(display().textContent).toBe('4')
  })

  it('holds a static HELLO and starts no timer when reduced motion is preferred', () => {
    mockReducedMotion(true)
    renderInSvg()

    expect(display().textContent).toBe('HELLO')

    act(() => { vi.advanceTimersByTime(5000) })

    expect(display().textContent).toBe('HELLO')
    expect(display().getAttribute('opacity')).toBe('0.95')
    expect(vi.getTimerCount()).toBe(0)
  })
})
