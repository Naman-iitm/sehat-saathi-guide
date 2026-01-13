import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MedicalHistory } from "./medicalHistoryStorage";

export const exportMedicalHistoryPDF = (data: MedicalHistory) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Sehat Saathi – Medical History", 14, 20);

  doc.setFontSize(11);
  doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [["Field", "Details"]],
    body: [
      ["Blood Group", data.bloodGroup || "N/A"],
      ["Allergies", data.allergies || "N/A"],
      ["Chronic Conditions", data.chronicConditions || "N/A"],
      ["Surgeries / Illnesses", data.surgeries || "N/A"],
      ["Medications", data.medications || "N/A"],
    ],
  });

  doc.save("medical-history.pdf");
};
