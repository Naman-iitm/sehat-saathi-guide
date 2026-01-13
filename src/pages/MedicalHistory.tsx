import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  getMedicalHistory,
  saveMedicalHistory,
  MedicalHistory,
} from "@/lib/medicalHistoryStorage";

import { exportMedicalHistoryPDF } from "@/lib/exportMedicalHistory";
import { exportMedicalHistoryPNG } from "@/lib/exportMedicalHistoryPNG";
import { exportUploadedFilePDF } from "@/lib/exportUploadedFilePDF";
import { exportUploadedFilePNG } from "@/lib/exportUploadedFilePNG";

type Mode = "view" | "add" | "upload";

const emptyForm: MedicalHistory = {
  bloodGroup: "",
  allergies: "",
  chronicConditions: "",
  surgeries: "",
  medications: "",
};

const MedicalHistoryPage: React.FC = () => {
  const [form, setForm] = useState<MedicalHistory>(emptyForm);
  const [mode, setMode] = useState<Mode>("add");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const hasData =
    form.bloodGroup ||
    form.allergies ||
    form.chronicConditions ||
    form.surgeries ||
    form.medications;

  useEffect(() => {
    const data = getMedicalHistory();
    if (data) {
      setForm(data);
      setMode("view");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    saveMedicalHistory(form);
    setMode("view");
  };

  const handleExportPDF = () => {
    if (mode === "upload" && uploadedFile) {
      if (uploadedFile.type === "application/pdf") {
        const url = URL.createObjectURL(uploadedFile);
        const a = document.createElement("a");
        a.href = url;
        a.download = uploadedFile.name;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
      exportUploadedFilePDF(uploadedFile);
      return;
    }
    exportMedicalHistoryPDF(form);
  };

  const handleExportPNG = () => {
    if (mode === "upload" && uploadedFile) {
      if (!uploadedFile.type.startsWith("image/")) {
        alert("PNG export is only available for images.");
        return;
      }
      exportUploadedFilePNG(uploadedFile);
      return;
    }
    exportMedicalHistoryPNG();
  };

  const handleDeleteUpload = () => {
    setUploadedFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Card className="bg-background/80 backdrop-blur border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            🧾 Medical History
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* MODE SWITCH */}
          <div className="flex rounded-lg bg-secondary p-1">
            <button
              onClick={() => setMode("add")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === "add"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Add Details
            </button>
            <button
              onClick={() => setMode("upload")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === "upload"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Upload Report
            </button>
          </div>

          {/* VIEW MODE */}
          {mode === "view" && (
            <div className="space-y-2 text-sm">
              <p><b>Blood Group:</b> {form.bloodGroup || "—"}</p>
              <p><b>Allergies:</b> {form.allergies || "—"}</p>
              <p><b>Chronic Conditions:</b> {form.chronicConditions || "—"}</p>
              <p><b>Surgeries:</b> {form.surgeries || "—"}</p>
              <p><b>Medications:</b> {form.medications || "—"}</p>

              <Button className="w-full mt-4" onClick={() => setMode("add")}>
                Edit Details
              </Button>
            </div>
          )}

          {/* ADD MODE */}
          {mode === "add" && (
            <div className="space-y-3">
              {/* FIXED BLOOD GROUP SELECT */}
              <select
                value={form.bloodGroup}
                onChange={(e) =>
                  setForm({ ...form, bloodGroup: e.target.value })
                }
                className="w-full p-3 rounded-md bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Blood Group</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>

              <Input name="allergies" placeholder="Allergies" value={form.allergies} onChange={handleChange} />
              <Input name="chronicConditions" placeholder="Chronic Conditions" value={form.chronicConditions} onChange={handleChange} />
              <Input name="surgeries" placeholder="Surgeries / Illnesses" value={form.surgeries} onChange={handleChange} />
              <Input name="medications" placeholder="Medications" value={form.medications} onChange={handleChange} />

              <Button className="w-full" onClick={handleSave}>
                Save Medical History
              </Button>
            </div>
          )}

          {/* UPLOAD MODE */}
          {mode === "upload" && (
            <div className="space-y-4">
              <label className="flex items-center justify-center h-32 border border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/40 transition">
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag & drop
                </span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  hidden
                  onChange={(e) =>
                    setUploadedFile(e.target.files?.[0] || null)
                  }
                />
              </label>

              {uploadedFile && (
                <div className="flex gap-3">
                  <Button className="flex-1">
                    Save
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDeleteUpload}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* GLOBAL EXPORT SECTION */}
          {(hasData || uploadedFile) && (
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-xs text-muted-foreground text-center">
                Export your medical history for sharing or backup
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleExportPDF}
                >
                  📄 Export PDF
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleExportPNG}
                  disabled={
                    mode === "upload" &&
                    uploadedFile?.type === "application/pdf"
                  }
                >
                  🖼️ Export PNG
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalHistoryPage;
