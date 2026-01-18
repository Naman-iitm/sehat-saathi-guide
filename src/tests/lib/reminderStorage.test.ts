import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getReminders, saveReminders } from '@/lib/reminderStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Reminder Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('getReminders', () => {
    it('should return empty array when no reminders exist', () => {
      const result = getReminders();
      expect(result).toEqual([]);
    });

    it('should return parsed reminders from localStorage', () => {
      const mockReminders = [
        { id: '1', title: 'Take medicine', time: '09:00', date: '2026-01-15' },
      ];
      localStorageMock.setItem('sehat-saathi-reminders', JSON.stringify(mockReminders));

      const result = getReminders();
      expect(result).toEqual(mockReminders);
    });

    it('should return empty array on parse error', () => {
      localStorageMock.setItem('sehat-saathi-reminders', 'invalid json');

      const result = getReminders();
      expect(result).toEqual([]);
    });
  });

  describe('saveReminders', () => {
    it('should save reminders to localStorage', () => {
      const reminders = [
        { id: '1', title: 'Take medicine', time: '09:00', date: '2026-01-15' },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      saveReminders(reminders as any);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sehat-saathi-reminders',
        JSON.stringify(reminders)
      );
    });

    it('should save empty array', () => {
      saveReminders([]);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sehat-saathi-reminders',
        '[]'
      );
    });
  });
});
