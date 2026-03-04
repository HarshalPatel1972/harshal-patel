import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

// Mock animejs to skip animations in tests
vi.mock('animejs', () => ({
  animate: vi.fn(() => ({ pause: vi.fn(), restart: vi.fn() })),
  set: vi.fn(),
}))

// Mock window.matchMedia if not present (JSDOM doesn't support it fully)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
