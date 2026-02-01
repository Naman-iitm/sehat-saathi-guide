import React, { useState, useRef } from "react";
import {
    Camera,
    Upload,
    FileText,
    AlertTriangle,
    CheckCircle,
    Plus,
    ShoppingCart,
    ArrowRight,
    RefreshCw,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { medicines } from "@/data/medicines";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface ExtractedMedicine {
    name: string;
    dosage: string;
    frequency: string;
    instructions: string;
    duration: string;
    isAvailable?: boolean;
}

interface Interaction {
    drugs: string[];
    severity: string;
    message: string;
}

const PrescriptionOCR: React.FC = () => {
    const { t, language } = useLanguage();
    const { token } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<{
        medicines: ExtractedMedicine[];
        interactions: Interaction[];
        doctorName?: string;
        notes?: string;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !token) {
            toast.error("Please select a prescription image and login first");
            return;
        }

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("prescription", file);

        try {
            const response = await fetch(`${API_URL}/api/ai/analyze-prescription`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                // Check availability in store (fuzzy match)
                const enrichedMedicines = data.data.medicines.map((m: any) => {
                    const isAvailable = medicines.some(storeMed =>
                        storeMed.name.toLowerCase().includes(m.name.toLowerCase()) ||
                        m.name.toLowerCase().includes(storeMed.name.toLowerCase())
                    );
                    return { ...m, isAvailable };
                });

                setResult({
                    ...data.data,
                    medicines: enrichedMedicines
                });
                toast.success("Prescription analyzed successfully!");
            } else {
                throw new Error(data.message || "Failed to analyze");
            }
        } catch (error: any) {
            console.error("Analysis Error:", error);
            toast.error(error.message || "Something went wrong during analysis");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const addToReminders = (medicine: ExtractedMedicine) => {
        // Logic to navigate to reminders or use a context to add it
        toast.success(`Started adding ${medicine.name} to reminders`);
        // Example: navigate('/reminders', { state: { ...medicine } })
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">AI Prescription Assistant</h1>
                <p className="text-muted-foreground">
                    Upload a photo of your prescription. Our AI will extract details and check for risks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Upload Section */}
                <Card className="border-dashed border-2 flex flex-col justify-center items-center p-6 text-center h-full">
                    {!preview ? (
                        <div
                            className="cursor-pointer space-y-4"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Camera className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Take a photo or upload image</p>
                                <p className="text-sm text-muted-foreground">JPEG, PNG up to 5MB</p>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Upload className="w-4 h-4" /> Select File
                            </Button>
                        </div>
                    ) : (
                        <div className="relative w-full h-full min-h-[300px]">
                            <img
                                src={preview}
                                alt="Prescription Preview"
                                className="rounded-lg object-contain w-full h-full max-h-[400px]"
                            />
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute top-2 right-2 rounded-full shadow-md"
                                onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />

                    {preview && !result && (
                        <Button
                            className="mt-6 w-full gap-2"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing with Gemini AI...
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="w-4 h-4" /> Start Analysis
                                </>
                            )}
                        </Button>
                    )}
                </Card>

                {/* Info Section or Quick Stats */}
                {!result ? (
                    <Card className="bg-muted/30 border-none flex flex-col justify-center p-6 space-y-6">
                        <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold">Automated OCR</h3>
                                <p className="text-sm text-muted-foreground">Extracts medicine names and dosages even from messy handwriting.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold">Interaction Warnings</h3>
                                <p className="text-sm text-muted-foreground">Alerts you if prescribed medicines react badly together.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold">Store Availability</h3>
                                <p className="text-sm text-muted-foreground">Checks if the medicines are available in the Sehat Saathi store.</p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-6 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Interaction Alerts */}
                        {result.interactions.length > 0 && (
                            <Card className="border-destructive bg-destructive/5">
                                <CardHeader className="py-3">
                                    <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                                        <AlertTriangle className="w-5 h-5" /> Safety Warnings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 py-3">
                                    {result.interactions.map((int, i) => (
                                        <div key={i} className="text-sm border-l-2 border-destructive pl-3">
                                            <p className="font-bold">{int.drugs.join(" + ")}</p>
                                            <p className="text-muted-foreground">{int.message}</p>
                                            <Badge variant="destructive" className="mt-1">{int.severity}</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Doctor Info */}
                        {(result.doctorName || result.notes) && (
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-md flex items-center gap-2">
                                        <Info className="w-4 h-4" /> General Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1">
                                    {result.doctorName && <p><span className="font-semibold">Doctor:</span> {result.doctorName}</p>}
                                    {result.notes && <p><span className="font-semibold">Notes:</span> {result.notes}</p>}
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Prescribed Medicines</h3>
                            {result.medicines.map((med, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-primary">{med.name}</h4>
                                                <p className="text-xs text-muted-foreground">{med.dosage} • {med.frequency}</p>
                                            </div>
                                            <Badge variant={med.isAvailable ? "default" : "outline"} className={med.isAvailable ? "bg-green-500" : ""}>
                                                {med.isAvailable ? "Available" : "Not in store"}
                                            </Badge>
                                        </div>

                                        <div className="bg-muted/30 p-2 rounded text-xs mb-3">
                                            <p><span className="font-semibold">Instructions:</span> {med.instructions}</p>
                                            <p><span className="font-semibold">Duration:</span> {med.duration}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 gap-1 h-8 text-xs bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
                                                onClick={() => addToReminders(med)}
                                            >
                                                <Plus className="w-3 h-3" /> Remind Me
                                            </Button>
                                            {med.isAvailable && (
                                                <Button
                                                    size="sm"
                                                    className="flex-1 gap-1 h-8 text-xs"
                                                    onClick={() => toast.success(`Added ${med.name} to cart`)}
                                                >
                                                    <ShoppingCart className="w-3 h-3" /> Buy Now
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {result && (
                <div className="flex justify-center mt-8">
                    <Button variant="ghost" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
                        Analyze Another Prescription
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PrescriptionOCR;
