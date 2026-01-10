import { SeverityLevel } from "./types";

interface Rule {
  symptoms: string[];
  severity: SeverityLevel;
  message: string;
  recommendedAction: string;
}

export const TRIAGE_RULES: Rule[] = [
  // 🔴 EMERGENCY
  {
    symptoms: ["chest pain", "shortness of breath"],
    severity: "high",
    message: "Critical symptoms detected indicating possible emergency.",
    recommendedAction: "Call emergency services immediately.",
  },

  // 🔴 Single critical symptoms
  {
    symptoms: ["chest pain"],
    severity: "high",
    message: "Chest pain can indicate a serious medical condition.",
    recommendedAction: "Seek immediate medical attention.",
  },
  {
    symptoms: ["shortness of breath"],
    severity: "high",
    message: "Breathing difficulty may be dangerous.",
    recommendedAction: "Seek immediate medical attention.",
  },

  // 🟡 MEDIUM – fatigue alone
  {
    symptoms: ["fatigue"],
    severity: "medium",
    message: "Ongoing fatigue may require medical attention.",
    recommendedAction: "Consult a healthcare professional if symptoms persist.",
  },

  // 🟡 MEDIUM – combo
  {
    symptoms: ["persistent fever", "fatigue"],
    severity: "medium",
    message: "Symptoms may require medical consultation.",
    recommendedAction: "Consult a healthcare professional.",
  },

  // 🟢 LOW
  {
    symptoms: ["fever", "cough", "sore throat"],
    severity: "low",
    message: "Mild flu-like symptoms detected.",
    recommendedAction: "Rest, stay hydrated, and monitor symptoms.",
  },
];