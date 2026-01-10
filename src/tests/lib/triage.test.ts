import { describe, it, expect } from 'vitest';
import { evaluateSymptoms } from '@/lib/triage/evaluator';

describe('Triage Evaluator', () => {
  describe('evaluateSymptoms', () => {
    it('should return emergency level for chest pain with shortness of breath', () => {
      const result = evaluateSymptoms({
        symptoms: ['chest pain', 'shortness of breath'],
      });

      expect(result.severity).toBe('high');
      expect(result.recommendedAction).toContain('emergency');
    });

    it('should return high severity for chest pain alone', () => {
      const result = evaluateSymptoms({
        symptoms: ['chest pain'],
      });

      expect(result.severity).toBe('high');
      expect(result.message).toContain('serious medical condition');
    });

    it('should return high severity for shortness of breath alone', () => {
      const result = evaluateSymptoms({
        symptoms: ['shortness of breath'],
      });

      expect(result.severity).toBe('high');
      expect(result.message).toContain('Breathing difficulty');
    });

    it('should return medium severity for fatigue', () => {
      const result = evaluateSymptoms({
        symptoms: ['fatigue'],
      });

      expect(result.severity).toBe('medium');
      expect(result.recommendedAction).toContain('healthcare professional');
    });

    it('should return medium severity for persistent fever with fatigue', () => {
      const result = evaluateSymptoms({
        symptoms: ['persistent fever', 'fatigue'],
      });

      expect(result.severity).toBe('medium');
    });

    it('should return low severity for mild flu symptoms', () => {
      const result = evaluateSymptoms({
        symptoms: ['fever', 'cough', 'sore throat'],
      });

      expect(result.severity).toBe('low');
      expect(result.message).toContain('flu-like');
    });

    it('should return default low severity for unknown symptoms', () => {
      const result = evaluateSymptoms({
        symptoms: ['headache', 'runny nose'],
      });

      expect(result.severity).toBe('low');
      expect(result.message).toBe('No serious symptoms detected.');
    });

    it('should return default result for empty symptoms', () => {
      const result = evaluateSymptoms({
        symptoms: [],
      });

      expect(result.severity).toBe('low');
      expect(result.recommendedAction).toContain('Monitor');
    });

    it('should prioritize higher severity when multiple rules match', () => {
      // This includes both high severity (chest pain) and low severity symptoms
      const result = evaluateSymptoms({
        symptoms: ['chest pain', 'fever', 'cough', 'sore throat'],
      });

      expect(result.severity).toBe('high');
    });
  });
});
