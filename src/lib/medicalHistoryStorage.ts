export type MedicalHistory = {
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  surgeries: string;
  medications: string;
};

const STORAGE_KEY = 'medical_history';

export const getMedicalHistory = (): MedicalHistory | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveMedicalHistory = (history: MedicalHistory) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const clearMedicalHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
