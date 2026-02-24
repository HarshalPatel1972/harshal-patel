import { render, screen, act } from '@testing-library/react'
import { Hero } from '../Hero'
import { usePreloader } from '@/lib/preloader-context'
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest'

// Mock the usePreloader hook
vi.mock('@/lib/preloader-context', () => ({
  usePreloader: vi.fn(),
}))

// Mock HeroGrid to avoid complex DOM calculations
vi.mock('@/components/ui/HeroGrid', () => ({
  HeroGrid: () => <div data-testid="hero-grid" />,
}))

describe('Hero Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Default mock return: not complete
    ;(usePreloader as Mock).mockReturnValue({ isComplete: false })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  it('renders correctly but hides content initially', () => {
    render(<Hero />)

    // Check if background image is present
    expect(screen.getByAltText('Harshal Patel')).toBeInTheDocument()

    // Content should not be visible yet (showContent is false)
    expect(screen.queryByText('I')).not.toBeInTheDocument()
    expect(screen.queryByText('CAN')).not.toBeInTheDocument()
  })

  it('shows content 100ms after preloader completes', () => {
    // Start with complete = true
    ;(usePreloader as Mock).mockReturnValue({ isComplete: true })

    render(<Hero />)

    // Initially still hidden (due to setTimeout 100ms)
    expect(screen.queryByText('I')).not.toBeInTheDocument()

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(100)
    })

    // Now content should be visible
    expect(screen.getByText('I')).toBeInTheDocument()
    expect(screen.getByText('CAN')).toBeInTheDocument()
    expect(screen.getByText('DO')).toBeInTheDocument()
    expect(screen.getByText('THIS')).toBeInTheDocument()
    expect(screen.getByText('ALL')).toBeInTheDocument()
    expect(screen.getByText('DAY')).toBeInTheDocument()
  })

  it('cycles through questions every 3500ms', () => {
    ;(usePreloader as Mock).mockReturnValue({ isComplete: true })
    render(<Hero />)

    act(() => {
      vi.advanceTimersByTime(100) // Show content
    })

    const questionDisplay = screen.getByTestId('question-display')

    // Initial question: "Designing Systems?"
    // The text content might be squashed due to multiple spans, e.g. "DesigningSystems?"
    expect(questionDisplay.textContent).toContain('Designing')
    expect(questionDisplay.textContent).toContain('Systems')

    // Advance 3500ms -> "Shipping Features?"
    act(() => {
      vi.advanceTimersByTime(3500)
    })

    expect(questionDisplay.textContent).toContain('Shipping')
    expect(questionDisplay.textContent).toContain('Features')

    // Advance 3500ms -> "Crafting UI?"
    act(() => {
      vi.advanceTimersByTime(3500)
    })

    expect(questionDisplay.textContent).toContain('Crafting')
    expect(questionDisplay.textContent).toContain('UI')
  })

  it('updates blinker index correctly', () => {
    ;(usePreloader as Mock).mockReturnValue({ isComplete: true })
    render(<Hero />)

    act(() => {
      vi.advanceTimersByTime(100) // Show content
    })

    // Initial state: blinkerIndex = 0.
    // "I" should have opacity 1. Others 0.3.
    // We can check style opacity.

    const iElement = screen.getByText('I')
    const canElement = screen.getByText('CAN')

    // Helper to check opacity
    const checkOpacity = (element: HTMLElement, expectedOpacity: string) => {
      // Since styles are inline, we can check style.opacity
      // Wait, let's verify if style is applied directly to the element found by getByText.
      // Looking at Hero.tsx:
      // <span ... style={{ ... opacity: blinkerIndex === 0 ? 1 : 0.3 }}>I</span>
      expect(element).toHaveStyle({ opacity: expectedOpacity })
    }

    // Initial: index 0
    checkOpacity(iElement, '1')
    checkOpacity(canElement, '0.3') // Index 1 is 0.3

    // Advance 400ms -> index 1
    // Wait, the interval starts AFTER showContent is true.
    // So 400ms after showContent=true, it should increment.
    act(() => {
      vi.advanceTimersByTime(400)
    })

    checkOpacity(iElement, '0.3')
    checkOpacity(canElement, '1')
  })
})
