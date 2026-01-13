import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('should merge class names', () => {
      const result = cn('px-4', 'py-2');
      expect(result).toBe('px-4 py-2');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });

    it('should filter out falsy values', () => {
      const result = cn('base', false, null, undefined, 'end');
      expect(result).toBe('base end');
    });

    it('should merge conflicting Tailwind classes correctly', () => {
      const result = cn('px-4', 'px-6');
      expect(result).toBe('px-6');
    });

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2']);
      expect(result).toBe('class1 class2');
    });

    it('should handle object syntax', () => {
      const result = cn({
        'active': true,
        'disabled': false,
        'visible': true,
      });
      expect(result).toBe('active visible');
    });

    it('should return empty string for no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle complex Tailwind merging', () => {
      const result = cn(
        'bg-red-500 text-white',
        'bg-blue-500' // Should override bg-red-500
      );
      expect(result).toBe('text-white bg-blue-500');
    });
  });
});
