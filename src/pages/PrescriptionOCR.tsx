import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Loader2, AlertCircle, ShoppingCart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PrescriptionOCR: React.FC = () => {
    const { token } = useAuth();
    const { toast } = useToast();
    const { addToCart } = useCart();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [interactions, setInteractions] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setResult(null); // Reset previous result
        }
    };

    const handleAnalyze = async () => {
        if (!file || !token) return;

        setAnalyzing(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${API_URL}/ai/analyze-prescription`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const json = await res.json();

            if (json.success) {
                setResult(json.data);
                // After analysis, check for interactions
                if (json.data.medicines?.length > 1) {
                    checkInteractions(json.data.medicines.map((m: any) => m.name));
                }
            } else {
                toast({ title: "Analysis Failed", description: json.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setAnalyzing(false);
        }
    };

    const checkInteractions = async (medicines: string[]) => {
        try {
            const res = await fetch(`${API_URL}/ai/check-interactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ medicines })
            });
            const json = await res.json();
            if (json.success) {
                setInteractions(json.data || []);
            }
        } catch (e) { console.error(e); }
    };

    const handleAddToCart = (medicineName: string) => {
        // Mock finding the medicine
        addToCart({
            id: Date.now().toString(),
            name: medicineName,
            nameHi: medicineName, // Fallback for Hindi name
            price: 150, // Mock price
            image: "https://via.placeholder.com/150",
            // category: "Prescription" // category not in CartItem interface based on CartContext.tsx view
        });
        toast({ title: "Added to Cart", description: `${medicineName} added.` });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Prescription Analyzer</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Prescription</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {preview ? (
                                <img src={preview} alt="Prescription" className="max-h-64 object-contain" />
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Click to upload or drag & drop</p>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <Button
                            className="w-full"
                            disabled={!file || analyzing}
                            onClick={handleAnalyze}
                        >
                            {analyzing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing with Gemini AI...</>
                            ) : "Analyze Prescription"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div className="space-y-6">
                    {result && (
                        <Card className="animate-in fade-in slide-in-from-bottom-5">
                            <CardHeader>
                                <CardTitle>Analysis Results</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Diagnosis */}
                                {result.diagnosis && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <h3 className="font-semibold text-blue-700 dark:text-blue-300">Diagnosis</h3>
                                        <p>{result.diagnosis}</p>
                                    </div>
                                )}

                                {/* Warnings */}
                                {interactions.length > 0 && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Drug Interaction Warning</AlertTitle>
                                        <AlertDescription>
                                            <ul className="list-disc pl-4 mt-2">
                                                {interactions.map((w, i) => <li key={i}>{w}</li>)}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Medicines */}
                                <div>
                                    <h3 className="font-semibold mb-3">Extracted Medicines</h3>
                                    <div className="space-y-3">
                                        {result.medicines?.map((med: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-3 border rounded shadow-sm bg-card">
                                                <div>
                                                    <p className="font-bold">{med.name}</p>
                                                    <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => handleAddToCart(med.name)}>
                                                    <ShoppingCart className="w-4 h-4 mr-2" /> Buy
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionOCR;
