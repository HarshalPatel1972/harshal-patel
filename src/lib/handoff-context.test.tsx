import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { HandoffProvider, useHandoff } from './handoff-context';
import React from 'react';

describe('HandoffContext', () => {
  it('provides initial state', () => {
    const { result } = renderHook(() => useHandoff(), {
      wrapper: HandoffProvider,
    });
    expect(result.current.stage).toBe(0);
  });

  it('increments stage', () => {
    const { result } = renderHook(() => useHandoff(), {
      wrapper: HandoffProvider,
    });

    act(() => {
      result.current.nextStage();
    });

    expect(result.current.stage).toBe(1);
  });

  it('stops incrementing at 7', () => {
    const { result } = renderHook(() => useHandoff(), {
      wrapper: HandoffProvider,
    });

    // Increment 8 times to exceed the limit
    act(() => {
      for(let i = 0; i < 8; i++) {
        result.current.nextStage();
      }
    });

    expect(result.current.stage).toBe(7);
  });

  it('resets stage', () => {
    const { result } = renderHook(() => useHandoff(), {
      wrapper: HandoffProvider,
    });

    act(() => {
      result.current.nextStage();
      result.current.nextStage();
    });
    expect(result.current.stage).toBe(2);

    act(() => {
      result.current.resetStage();
    });
    expect(result.current.stage).toBe(0);
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test as React logs the error
    const originalError = console.error;
    console.error = vi.fn();

    try {
        expect(() => renderHook(() => useHandoff())).toThrow("useHandoff must be used within HandoffProvider");
    } finally {
        console.error = originalError;
    }
  });
});
