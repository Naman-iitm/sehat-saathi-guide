export type SeverityLevel =
  | "low"
  | "medium"
  | "high"
  | "emergency";

export interface SymptomInput {
  symptoms: string[];
  age?: number;
  durationInDays?: number;
}

export interface TriageResult {
  severity: SeverityLevel;
  message: string;
  recommendedAction: string;
}