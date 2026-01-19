import { LabTest } from "@/types/labTest";

const KEY = "sehat-saathi-lab-tests";

export const getLabTests = (): LabTest[] => {
  const saved = localStorage.getItem(KEY);
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveLabTests = (tests: LabTest[]) => {
  localStorage.setItem(KEY, JSON.stringify(tests));
};
