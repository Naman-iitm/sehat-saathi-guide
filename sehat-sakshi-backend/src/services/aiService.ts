import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface PrescriptionAnalysis {
    medicines: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }>;
    diagnosis: string;
    instructions: string[];
    warnings: string[];
}

export const analyzePrescription = async (filePath: string): Promise<PrescriptionAnalysis> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imageBuffer = fs.readFileSync(filePath);
        const imageBase64 = imageBuffer.toString("base64");

        const prompt = `
            Analyze this prescription image and extract the following details in strict JSON format:
            1. List of medicines (name, dosage, frequency, duration).
            2. Diagnosis (if mentioned).
            3. Special instructions.
            4. Potential warnings (e.g., drug interactions or excessive dosage).

            Output format:
            {
                "medicines": [{"name": "...", "dosage": "...", "frequency": "...", "duration": "..."}],
                "diagnosis": "...",
                "instructions": ["..."],
                "warnings": ["..."]
            }
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: "image/jpeg" // Assuming JPEG, but could be PNG. Gemini handles it well.
                }
            }
        ]);

        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new Error("Failed to analyze prescription.");
    }
};

export const checkDrugInteractions = async (medicines: string[]): Promise<string[]> => {
    // Mocked implementation - in reality, use an external API like DrugBank or similar
    // Or ask Gemini to check interactions based on names
    if (medicines.length < 2) return [];

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
            Check for drug interactions between these medicines: ${medicines.join(", ")}.
            Return a list of warnings if any interactions exist. If none, return empty list.
            Output strict JSON: ["Warning 1", "Warning 2"]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (e) {
        return [];
    }
};
