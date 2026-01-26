import React, { useState, useEffect } from "react";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    BrainCircuit,
    Activity,
    Calendar,
    AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface PredictionData {
    riskLevel: "Low" | "Moderate" | "High";
    trend: "Improving" | "Stable" | "Worsening";
    predictedIssues: string[];
    recommendations: string[];
    doctorSummary: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PredictiveAnalytics: React.FC = () => {
    const { token } = useAuth();
    const [data, setData] = useState<PredictionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchPrediction();
    }, [token]);

    const fetchPrediction = async () => {
        try {
            const res = await fetch(`${API_URL}/api/prediction`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) setData(json.data);
        } catch (err) {
            console.error("Prediction Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Skeleton className="w-full h-64 rounded-xl" />;

    if (!data) return null;

    const getTrendIcon = () => {
        switch (data.trend) {
            case "Improving": return <TrendingUp className="w-6 h-6 text-green-500" />;
            case "Worsening": return <TrendingDown className="w-6 h-6 text-red-500" />;
            default: return <Minus className="w-6 h-6 text-gray-500" />;
        }
    };

    const getRiskColor = () => {
        switch (data.riskLevel) {
            case "High": return "bg-red-100 text-red-800 border-red-200";
            case "Moderate": return "bg-orange-100 text-orange-800 border-orange-200";
            default: return "bg-green-100 text-green-800 border-green-200";
        }
    };

    return (
        <Card className="border-2 border-indigo-100 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 overflow-hidden">
            <CardHeader className="border-b border-indigo-100 dark:border-indigo-900 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-indigo-600" />
                        <div>
                            <CardTitle className="text-lg text-indigo-900 dark:text-indigo-100">AI Health Forecast</CardTitle>
                            <CardDescription>Predictive analysis based on 6-month history</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className={`${getRiskColor()} px-3 py-1 font-bold`}>
                        {data.riskLevel} Risk
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-indigo-100 dark:divide-indigo-800">
                    {/* Access & Trend */}
                    <div className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                            {getTrendIcon()}
                        </div>
                        <span className="font-semibold text-muted-foreground">Overall Trend</span>
                        <span className="text-xl font-bold">{data.trend}</span>
                    </div>

                    {/* Predictions */}
                    <div className="p-6 md:col-span-2 space-y-4">
                        <div>
                            <h4 className="flex items-center gap-2 font-semibold mb-2 text-indigo-800 dark:text-indigo-300">
                                <AlertTriangle className="w-4 h-4" /> Potential Risks (Next 7 Days)
                            </h4>
                            <ul className="space-y-1">
                                {data.predictedIssues.map((issue, i) => (
                                    <li key={i} className="text-sm bg-white/60 dark:bg-black/20 px-3 py-2 rounded border border-indigo-50 dark:border-indigo-900 flex items-start gap-2">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 font-semibold mb-2 text-green-800 dark:text-green-300">
                                <Activity className="w-4 h-4" /> AI Recommendations
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {data.recommendations.map((rec, i) => (
                                    <Badge key={i} variant="secondary" className="bg-white/80 hover:bg-white text-xs py-1">
                                        {rec}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctor Note */}
                <div className="bg-indigo-900/5 dark:bg-indigo-500/10 p-4 text-sm border-t border-indigo-100 dark:border-indigo-900">
                    <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">Doctor's AI Summary:</p>
                    <p className="italic text-muted-foreground">"{data.doctorSummary}"</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PredictiveAnalytics;
