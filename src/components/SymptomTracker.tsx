import { evaluateSymptoms } from "@/lib/triage";
import type { TriageResult } from "@/lib/triage";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Symptom } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Calendar, Clock, FileText } from "lucide-react";

import { Download } from "lucide-react";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const severityStyles = {
  low: {
    border: "border-green-300",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  medium: {
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
  },
  high: {
    border: "border-red-300",
    bg: "bg-red-50",
    text: "text-red-700",
  },
};

const SymptomTracker: React.FC = () => {
  const { t, language } = useLanguage();
 console.log("CURRENT LANGUAGE:", language);
  const [symptoms, setSymptoms] = useState<Symptom[]>(() => {
    const saved = localStorage.getItem("symptoms");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing symptoms from localStorage:", error);
      return [];
    }
  });

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [newSymptom, setNewSymptom] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("symptoms", JSON.stringify(symptoms));

    if (symptoms.length === 0) {
      setTriageResult(null);
      return;
    }

    const result = evaluateSymptoms({
      symptoms: symptoms.map((s) => s.name.toLowerCase()),
    });

    console.log("TRIAGE RESULT:", result);

    setTriageResult(result);
  }, [symptoms]);

  

  const handleAdd = () => {
    const trimmed = newSymptom.trim();

    if (!trimmed) {
      setError(t.emptySymptomError);
      toast.error(t.emptySymptomError);
      return;
    }

    const now = new Date();

    const symptom: Symptom = {
      id: Date.now().toString(),
      name: trimmed,
      description: newDescription.trim(),
      date: now.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN"),
      time: now.toLocaleTimeString(language === "hi" ? "hi-IN" : "en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSymptoms((prev) => [symptom, ...prev]);
    setNewSymptom("");
    setNewDescription("");
    setError("");

    toast.success(
      language === "hi"
        ? "लक्षण जोड़ा गया!"
        : "Symptom added successfully!"
    );
  };

  const handleDelete = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
    toast.success(language === "hi" ? "लक्षण हटाया गया" : "Symptom removed");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleExportCSV = () => {
  const result = exportToCSV(symptoms);
  if (result) {
    toast.success(
      language === "hi"
        ? "CSV डाउनलोड हो गया!"
        : "CSV downloaded successfully!"
    );
  } else {
    toast.error(
      language === "hi"
        ? "कोई लक्षण निर्यात करने के लिए नहीं"
        : "No symptoms to export"
    );
  }
};

const handleExportPDF = () => {
  const result = exportToPDF(symptoms, language);
  if (result) {
    toast.success(
      language === "hi"
        ? "PDF डाउनलोड हो गया!"
        : "PDF downloaded successfully!"
    );
  } else {
    toast.error(
      language === "hi"
        ? "कोई लक्षण निर्यात करने के लिए नहीं"
        : "No symptoms to export"
    );
  }
};

  const styles = triageResult
    ? severityStyles[triageResult.severity]
    : null;

  const triageText = {
  low: {
    en: {
      label: "Severity",
      action: "Recommended Action",
    },
    hi: {
      label: "गंभीरता",
      action: "अनुशंसित कार्रवाई",
    },
  },
  medium: {
    en: {
      label: "Severity",
      action: "Recommended Action",
    },
    hi: {
      label: "गंभीरता",
      action: "अनुशंसित कार्रवाई",
    },
  },
  high: {
    en: {
      label: "Severity",
      action: "Recommended Action",
    },
    hi: {
      label: "गंभीरता",
      action: "अनुशंसित कार्रवाई",
    },
  },
};

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      

      {/* TRIAGE RESULT */}
      {triageResult && styles && (
        <Card className={`border-2 ${styles.border} ${styles.bg}`}>
          <CardHeader>
            <CardTitle className={styles.text}>
  {language === "hi" ? "गंभीरता" : "Severity:"}:
  {" "}
  {triageResult.severity.toUpperCase()}
</CardTitle>
          </CardHeader>

          <CardContent>
            <p className={`mb-2 ${styles.text}`}>
              {triageResult.message}
            </p>

            <p className="font-medium mt-2">
  {language === "hi" ? "अनुशंसित कार्रवाई" : "Recommended Action:"}:
</p>
            <p>{triageResult.recommendedAction}</p>

            <p className="mt-4 text-sm text-gray-600">
              ⚠️ This tool provides informational guidance only and is not a medical diagnosis.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ADD SYMPTOM */}
      <Card>
        <CardHeader className="bg-secondary">
          <CardTitle className="flex items-center gap-3">
            <Plus /> {t.addSymptom}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <Input
            value={newSymptom}
            onChange={(e) => {
              setNewSymptom(e.target.value);
              if (error) setError("");
            }}
            onKeyPress={handleKeyPress}
            placeholder={t.symptomName}
            className={`border-2 ${
              error ? "border-destructive" : "border-input"
            }`}
          />

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder={t.symptomDescription}
          />

          <Button onClick={handleAdd} className="w-full gap-2">
            <Plus /> {t.addSymptom}
          </Button>
        </CardContent>
      </Card>

      {/* SYMPTOM LIST */}
      <div className="flex justify-between items-center">
  <h2 className="text-xl font-bold">
    {language === "hi" ? "आपके लक्षण" : "Your Symptoms"}
  </h2>
  
  {symptoms.length > 0 && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          {language === "hi" ? "निर्यात करें" : "Export Data"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportCSV}>
          📊 {language === "hi" ? "CSV के रूप में" : "Download as CSV"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          📄 {language === "hi" ? "PDF के रूप में" : "Download as PDF"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}
</div>

      {symptoms.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="text-center py-10">
            <FileText className="mx-auto mb-4" />
            {t.noSymptoms}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {symptoms.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex justify-between items-start p-4">
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  {s.description && (
                    <p className="text-sm text-muted-foreground">
                      {s.description}
                    </p>
                  )}

                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {s.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {s.time}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleDelete(s.id)}
                  className="border border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  <Trash2 size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SymptomTracker;