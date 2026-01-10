import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getMedicalHistory, saveMedicalHistory, clearMedicalHistory } from '@/lib/medicalHistoryStorage';

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

describe('Medical History Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('getMedicalHistory', () => {
    it('should return null when no history exists', () => {
      const result = getMedicalHistory();
      expect(result).toBeNull();
    });

    it('should return parsed history from localStorage', () => {
      const mockHistory = {
        bloodGroup: 'O+',
        allergies: 'Peanuts',
        chronicConditions: 'None',
        surgeries: 'None',
        medications: 'Vitamin D',
      };
      localStorageMock.setItem('medical_history', JSON.stringify(mockHistory));

      const result = getMedicalHistory();
      expect(result).toEqual(mockHistory);
    });
  });

  describe('saveMedicalHistory', () => {
    it('should save history to localStorage', () => {
      const history = {
        bloodGroup: 'A+',
        allergies: 'None',
        chronicConditions: 'Diabetes',
        surgeries: 'Appendectomy',
        medications: 'Metformin',
      };

      saveMedicalHistory(history);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'medical_history',
        JSON.stringify(history)
      );
    });
  });

  describe('clearMedicalHistory', () => {
    it('should remove history from localStorage', () => {
      clearMedicalHistory();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('medical_history');
    });
  });
});
