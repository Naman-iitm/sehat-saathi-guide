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
import { Plus, Trash2, Calendar, Clock, FileText, Download } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import { offlineDB } from "@/lib/offlineDB";
import { syncQueue } from "@/lib/syncQueue";
import { useOffline } from "@/hooks/useOffline";
import { useAuth } from "@/contexts/AuthContext";

import { exportToCSV, exportToPDF } from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { TrendingUp as TrendingIcon } from "lucide-react";

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
  const navigate = useNavigate();
  const { isOnline } = useOffline();
  const { token } = useAuth();
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

    // Save for Sync if offline or token available
    const saveSymptom = async () => {
      const symptomData = {
        symptoms: [trimmed],
        severity: triageResult?.severity || 'low',
        notes: newDescription.trim(),
        triageResult: triageResult ? {
          severity: triageResult.severity,
          message: triageResult.message,
          recommendedAction: triageResult.recommendedAction
        } : null
      };

      if (isOnline && token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/symptoms`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(symptomData)
          });

          if (!response.ok) throw new Error('API failed');
          console.log('Symptom synced immediately');
        } catch (err) {
          console.log('Sync failed, queuing offline');
          await offlineDB.addToQueue({
            type: 'symptom',
            data: symptomData,
            action: 'CREATE'
          });
        }
      } else {
        await offlineDB.addToQueue({
          type: 'symptom',
          data: symptomData,
          action: 'CREATE'
        });
        if (!isOnline) {
          toast.info(language === 'hi' ? 'ऑफ़लाइन सहेजा गया, बाद में सिंक होगा' : 'Saved offline, will sync later');
        }
      }
    };

    saveSymptom();

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
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-4 sm:space-y-6\">


      {/* TRIAGE RESULT */}
      {triageResult && styles && (
        <Card
          className={`border-2 ${styles.border} ${styles.bg}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <CardHeader>
            <CardTitle className={styles.text} id="triage-severity">
              {language === "hi" ? "गंभीरता" : "Severity:"}:
              {" "}
              {triageResult.severity.toUpperCase()}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className={`mb-2 ${styles.text}`} aria-labelledby="triage-severity">
              {triageResult.message}
            </p>

            <p className="font-medium mt-2" id="triage-action">
              {language === "hi" ? "अनुशंसित कार्रवाई" : "Recommended Action:"}:
            </p>
            <p aria-labelledby="triage-action">{triageResult.recommendedAction}</p>

            <p className="mt-4 text-sm text-gray-600" role="note">
              ⚠️ This tool provides informational guidance only and is not a medical diagnosis.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ADD SYMPTOM */}
      <Card>
        <CardHeader className="bg-secondary">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="add-symptom-title">
            <div className="flex items-center gap-3">
              <Plus aria-hidden="true" /> {t.addSymptom}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/analytics')}
              className="bg-background hover:bg-secondary gap-2 text-primary border-primary/20"
            >
              <TrendingIcon className="w-4 h-4" />
              {language === 'hi' ? 'विस्तृत विश्लेषण' : 'Detailed Analytics'}
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <div className="flex gap-2">
            <Input
              value={newSymptom}
              onChange={(e) => {
                setNewSymptom(e.target.value);
                if (error) setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder={t.symptomName}
              className={`flex-1 border-2 ${error ? "border-destructive" : "border-input"
                }`}
              aria-label={t.symptomName}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "symptom-error" : undefined}
              id="symptom-name-input"
            />
            <VoiceInput
              onTranscript={(text) => {
                setNewSymptom(text);
                if (error) setError("");
              }}
              aria-label={language === "hi" ? "आवाज से लक्षण का नाम दर्ज करें" : "Voice input for symptom name"}
            />
          </div>

          {error && (
            <p
              className="text-destructive text-sm"
              id="symptom-error"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder={t.symptomDescription}
              className="flex-1"
              aria-label={t.symptomDescription}
              id="symptom-description-input"
            />
            <VoiceInput
              onTranscript={(text) => setNewDescription(prev => prev ? `${prev} ${text}` : text)}
              className="self-start mt-2"
              aria-label={language === "hi" ? "आवाज से विवरण दर्ज करें" : "Voice input for symptom description"}
            />
          </div>

          <Button
            onClick={handleAdd}
            className="w-full gap-2"
            aria-label={t.addSymptom}
          >
            <Plus aria-hidden="true" /> {t.addSymptom}
          </Button>
        </CardContent>
      </Card>

      {/* SYMPTOM LIST */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold" id="symptoms-list-heading">
          {language === "hi" ? "आपके लक्षण" : "Your Symptoms"}
        </h2>

        {symptoms.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                aria-label={language === "hi" ? "लक्षण डेटा निर्यात करें" : "Export symptoms data"}
              >
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                {language === "hi" ? "निर्यात करें" : "Export Data"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={handleExportCSV}
                aria-label={language === "hi" ? "CSV फ़ाइल के रूप में डाउनलोड करें" : "Download as CSV file"}
              >
                <span aria-hidden="true">📊</span> {language === "hi" ? "CSV के रूप में" : "Download as CSV"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportPDF}
                aria-label={language === "hi" ? "PDF फ़ाइल के रूप में डाउनलोड करें" : "Download as PDF file"}
              >
                <span aria-hidden="true">📄</span> {language === "hi" ? "PDF के रूप में" : "Download as PDF"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {symptoms.length === 0 ? (
        <Card className="border-dashed border-2" role="status">
          <CardContent className="text-center py-10">
            <FileText className="mx-auto mb-4" aria-hidden="true" />
            <p>{t.noSymptoms}</p>
          </CardContent>
        </Card>
      ) : (
        <div
          className="space-y-4"
          role="list"
          aria-labelledby="symptoms-list-heading"
          aria-live="polite"
        >
          {symptoms.map((s, index) => (
            <Card key={s.id} role="listitem">
              <CardContent className="flex justify-between items-start p-4">
                <div>
                  <h3 className="font-semibold" id={`symptom-name-${s.id}`}>
                    {s.name}
                  </h3>
                  {s.description && (
                    <p
                      className="text-sm text-muted-foreground"
                      aria-label={language === "hi" ? "विवरण" : "Description"}
                    >
                      {s.description}
                    </p>
                  )}

                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} aria-hidden="true" />
                      <time dateTime={s.date}>{s.date}</time>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} aria-hidden="true" />
                      <time dateTime={s.time}>{s.time}</time>
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleDelete(s.id)}
                  className="border border-destructive text-destructive hover:bg-destructive hover:text-white"
                  aria-label={`${language === "hi" ? "हटाएं" : "Delete"} ${s.name}`}
                  title={`${language === "hi" ? "हटाएं" : "Delete"} ${s.name}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  <span className="sr-only">
                    {language === "hi" ? `${s.name} लक्षण हटाएं` : `Delete symptom ${s.name}`}
                  </span>
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