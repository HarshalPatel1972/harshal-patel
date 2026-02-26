import { render, screen, fireEvent } from '@testing-library/react';
import { Spotlight } from '../Spotlight';
import { describe, it, expect, vi } from 'vitest';

describe('Spotlight Component', () => {
  it('renders children correctly', () => {
    render(
      <Spotlight>
        <div data-testid="child">Child Content</div>
      </Spotlight>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('updates overlay background on mouse move', () => {
    render(
      <Spotlight className="w-[100px] h-[100px]" fill="rgb(255, 255, 255)">
        <div data-testid="child">Hover me</div>
      </Spotlight>
    );

    const container = screen.getByTestId('child').parentElement!; // The div wrapping children

    // We need to mock getBoundingClientRect because JSDOM doesn't implement layout
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
      width: 100,
      height: 100,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Simulate mouse enter
    fireEvent.mouseEnter(container);

    // Simulate mouse move to (50, 50)
    fireEvent.mouseMove(container, { clientX: 50, clientY: 50 });

    // Verify the overlay (first child of container) has the correct background
    const overlay = container.firstElementChild as HTMLElement;

    // Check if the style is updated.
    // The component sets: `radial-gradient(600px circle at ${x}px ${y}px, ${fill}, transparent 40%)`
    // x = 50 - 0 = 50
    // y = 50 - 0 = 50
    const expectedBackground = 'radial-gradient(600px circle at 50px 50px, rgb(255, 255, 255), transparent 40%)';

    expect(overlay.style.background).toBe(expectedBackground);
  });

  it('updates rect cache on scroll', () => {
    render(
      <Spotlight>
        <div data-testid="child">Scroll Check</div>
      </Spotlight>
    );

    const container = screen.getByTestId('child').parentElement!;
    const spy = vi.spyOn(container, 'getBoundingClientRect');

    // Clear initial call from mount
    spy.mockClear();

    // Trigger scroll on window
    fireEvent.scroll(window);

    // Expect getBoundingClientRect to be called to update cache
    expect(spy).toHaveBeenCalled();
  });
});
