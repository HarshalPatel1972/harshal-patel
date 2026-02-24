import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional class names', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle array inputs', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
  });

  it('should handle object inputs', () => {
    expect(cn({ class1: true, class2: false, class3: true })).toBe('class1 class3');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('should handle complex combinations', () => {
      expect(cn('text-base', ['p-4', { 'bg-red-500': true }], false && 'hidden')).toBe('text-base p-4 bg-red-500');
  });
});
