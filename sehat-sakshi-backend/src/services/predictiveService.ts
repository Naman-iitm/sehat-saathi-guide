import { GoogleGenerativeAI } from "@google/generative-ai";
import * as ss from "simple-statistics";
import { SymptomLog } from "../models/SymptomLog";
import { User } from "../models/User";

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface HealthPrediction {
    riskLevel: "Low" | "Moderate" | "High";
    trend: "Improving" | "Stable" | "Worsening";
    predictedIssues: string[];
    recommendations: string[];
    doctorSummary: string;
}

export class PredictiveService {
    /**
     * Generates a health prediction based on the last 6 months of data
     */
    async generatePrediction(userId: string): Promise<HealthPrediction> {
        // 1. Fetch Historical Data (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const logs = await SymptomLog.find({
            userId,
            createdAt: { $gte: sixMonthsAgo }
        }).sort({ createdAt: 1 });

        if (logs.length < 5) {
            return {
                riskLevel: "Low",
                trend: "Stable",
                predictedIssues: ["Not enough data for accurate prediction"],
                recommendations: ["Log more symptoms to enable AI insights"],
                doctorSummary: "Insufficient data history."
            };
        }

        // 2. Statistical Analysis (Time-Series / Anomaly)
        const severityMap: { [key: string]: number } = { mild: 1, moderate: 2, severe: 3 };
        const severityPoints = logs.map(l => severityMap[l.severity] || 0);

        // Linear Regression to find Trend (Slope)
        const regressionData = severityPoints.map((y, x) => [x, y]);
        const { m: slope } = ss.linearRegression(regressionData);

        let trend: "Improving" | "Stable" | "Worsening" = "Stable";
        if (slope > 0.1) trend = "Worsening";
        if (slope < -0.1) trend = "Improving";

        // 3. AI Interpretation (Gemini)
        let aiPrediction: any = {
            predictedIssues: [],
            recommendations: ["Maintain healthy lifestyle"],
            doctorSummary: "Patient seems stable based on automated analysis."
        };

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Prepare data summary for AI
            const symptomSummary = logs.map(l =>
                `${l.createdAt.toISOString().split('T')[0]}: ${l.symptoms.join(", ")} (${l.severity})`
            ).join("\n");

            const prompt = `
            Act as a Senior Medical Data Analyst. Analyze this patient's 6-month symptom log:
            ${symptomSummary}

            Current Statistical Trend: ${trend} (Slope: ${slope.toFixed(3)})

            Identify:
            1. Potential recurring patterns (e.g. seasonal, cyclical).
            2. Anomalies or spikes in severity.
            3. Future risks for the next week.
            
            Output strictly JSON:
            {
                "predictedIssues": ["Risk 1", "Risk 2"],
                "recommendations": ["Action 1", "Action 2"],
                "doctorSummary": "Professional summary for a GP."
            }
        `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            aiPrediction = JSON.parse(text);

        } catch (err) {
            console.error("AI Prediction Failed:", err);
        }

        return {
            riskLevel: slope > 0.2 ? "High" : slope > 0.05 ? "Moderate" : "Low",
            trend,
            predictedIssues: aiPrediction.predictedIssues || [],
            recommendations: aiPrediction.recommendations || [],
            doctorSummary: aiPrediction.doctorSummary
        };
    }

    /**
     * Detects seasonality or recurring clusters of symptoms
     */
    detectPatterns(logs: any[]) {
        // Basic implementation: Frequency count
        // Advanced: FFT or Autocorrelation could be used here
        return logs.length;
    }
}

export const predictiveService = new PredictiveService();
