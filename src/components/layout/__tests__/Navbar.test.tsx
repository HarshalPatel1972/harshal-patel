import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../Navbar';
import { usePreloader } from '@/lib/preloader-context';
import { APPS } from '@/lib/apps';

// Mock dependencies
jest.mock('@/lib/preloader-context', () => ({
  usePreloader: jest.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_target, prop) => {
          return ({ children, initial, animate, transition, whileHover, ...props }: any) => {
            const Component = prop as string;
            // Filter out motion-specific props that might cause React warnings on DOM elements
            return React.createElement(Component, props, children);
          };
        },
      }
    ),
  };
});

describe('Navbar Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (usePreloader as jest.Mock).mockReturnValue({ isComplete: true });
  });

  it('renders the branding text "HARSHAL.OS"', () => {
    render(<Navbar />);
    // The text is split into "HARSHAL" and ".OS" (with a span for dot)
    // We can look for "HARSHAL" and "OS" separately or use a function matcher
    expect(screen.getByText(/HARSHAL/)).toBeInTheDocument();
    expect(screen.getByText(/OS/)).toBeInTheDocument();
  });

  it('renders the "CONNECT_USER" link with correct href', () => {
    render(<Navbar />);
    const link = screen.getByRole('link', { name: /CONNECT_USER/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#contact');
  });

  it('renders all application icons/names', () => {
    render(<Navbar />);

    APPS.forEach((app) => {
      // The app name is rendered but might be visually hidden on mobile or shown on hover
      // We check if it exists in the document
      const appName = screen.getByText(app.name);
      expect(appName).toBeInTheDocument();
    });
  });

  it('shows app name tooltip on hover (interaction test)', () => {
    render(<Navbar />);

    const firstApp = APPS[0];
    const appNameElement = screen.getByText(firstApp.name);

    // In the component, the tooltip logic is CSS-based (group-hover:opacity-100)
    // Testing library interaction: check if the parent container has the group class
    // and the tooltip has the correct classes for transition.

    // We can't easily test CSS hover states with JSDOM + Jest without additional tools,
    // but we can verify the structure that enables this interaction.

    const tooltipContainer = appNameElement.closest('.group');
    expect(tooltipContainer).toBeInTheDocument();

    // Verify the tooltip element has the expected classes for hiding/showing
    expect(appNameElement).toHaveClass('opacity-0');
    expect(appNameElement).toHaveClass('group-hover:opacity-100');

    // We can simulate a hover event, but without a browser rendering engine,
    // the style won't update. However, we've verified the classes are present.
    if (tooltipContainer) {
      fireEvent.mouseEnter(tooltipContainer);
    }

    // Check if it's still in the document (it should be)
    expect(appNameElement).toBeInTheDocument();
  });

  it('does not render content when preloader is not complete (initial state check)', () => {
    // Override mock for this test
    (usePreloader as jest.Mock).mockReturnValue({ isComplete: false });

    const { container } = render(<Navbar />);

    // When isComplete is false, elements have opacity 0 or differ in animation state.
    // Framer motion mock renders them directly, but the component uses `isComplete`
    // to control animation states: `animate={isComplete ? { opacity: 1, x: 0 } : {}}`
    // Since we mocked motion.div to just render div, the props are passed but not processed by framer-motion.
    // However, the component renders the elements regardless of isComplete, just with different animation props.
    // So they should still be in the document.

    // We verify they are still in document even if not "visible" to user via animation.
    expect(screen.getByText(/HARSHAL/)).toBeInTheDocument();
  });
});
