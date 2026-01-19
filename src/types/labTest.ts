export interface LabTest {
  id: string;
  testName: string;
  value: string;
  unit: string;
  date: string;
  uploadedFile?: string; // base64 (optional)
}
