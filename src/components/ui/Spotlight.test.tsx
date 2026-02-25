import { render, fireEvent } from '@testing-library/react';
import { Spotlight } from './Spotlight';
import { vi, describe, it, expect, beforeEach, afterEach, MockInstance } from 'vitest';
import React from 'react';

describe('Spotlight Component Performance', () => {
  let getBoundingClientRectSpy: MockInstance;

  beforeEach(() => {
    // Spy on getBoundingClientRect
    getBoundingClientRectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect');
    getBoundingClientRectSpy.mockReturnValue({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls getBoundingClientRect significantly fewer times after optimization', () => {
    const { container } = render(
      <Spotlight className="w-20 h-20" fill="white">
        <div data-testid="content">Content</div>
      </Spotlight>
    );

    const spotlightDiv = container.firstChild as HTMLElement;
    expect(spotlightDiv).toBeInTheDocument();

    // Trigger mouse enter
    fireEvent.mouseEnter(spotlightDiv);

    // Trigger mouse moves (simulate 5 frames/moves)
    fireEvent.mouseMove(spotlightDiv, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(spotlightDiv, { clientX: 20, clientY: 20 });
    fireEvent.mouseMove(spotlightDiv, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(spotlightDiv, { clientX: 40, clientY: 40 });
    fireEvent.mouseMove(spotlightDiv, { clientX: 50, clientY: 50 });

    // Expect ONLY 1 call (on mouseEnter)
    // Previous unoptimized code would have called it 6 times (1 enter + 5 moves)
    expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(1);
  });

  it('invalidates cache on scroll', () => {
    const { container } = render(
      <Spotlight className="w-20 h-20" fill="white">
        <div data-testid="content">Content</div>
      </Spotlight>
    );

    const spotlightDiv = container.firstChild as HTMLElement;

    // 1. Mouse Enter -> 1 call
    fireEvent.mouseEnter(spotlightDiv);
    expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(1);

    // 2. Mouse Move -> 0 extra calls (total 1)
    fireEvent.mouseMove(spotlightDiv, { clientX: 10, clientY: 10 });
    expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(1);

    // 3. Scroll window -> invalidates cache
    fireEvent.scroll(window);

    // 4. Mouse Move -> Should call getBoundingClientRect again
    fireEvent.mouseMove(spotlightDiv, { clientX: 20, clientY: 20 });
    expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(2);
  });
});
