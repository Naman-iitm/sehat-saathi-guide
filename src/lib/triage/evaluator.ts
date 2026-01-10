import { TRIAGE_RULES } from "./rules";
import { SymptomInput, TriageResult, SeverityLevel } from "./types";

const severityPriority: Record<SeverityLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  emergency: 4
};

export function evaluateSymptoms(
  input: SymptomInput
): TriageResult {
  let highestSeverity = 0;
  let result: TriageResult | null = null;

  for (const rule of TRIAGE_RULES) {
    const matches = rule.symptoms.every(symptom =>
      input.symptoms.includes(symptom)
    );

    if (matches) {
      const priority = severityPriority[rule.severity];
      if (priority > highestSeverity) {
        highestSeverity = priority;
        result = {
          severity: rule.severity,
          message: rule.message,
          recommendedAction: rule.recommendedAction
        };
      }
    }
  }

  return (
    result ?? {
      severity: "low",
      message: "No serious symptoms detected.",
      recommendedAction: "Monitor your symptoms and rest."
    }
  );
}