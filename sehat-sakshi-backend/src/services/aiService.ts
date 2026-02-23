import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface PrescriptionData {
    medicines: {
        name: string;
        dosage: string;
        frequency: string;
        instructions: string;
        duration: string;
    }[];
    notes?: string;
    doctorName?: string;
}

/**
 * Service to handle Gemini AI operations for Prescription OCR
 */
export class AIService {
    /**
     * Analyzes an image of a prescription and extracts structured data
     * @param imagePath Path to the uploaded image file
     * @returns Structured prescription data
     */
    async analyzePrescription(imagePath: string): Promise<PrescriptionData> {
        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const imageBuffer = fs.readFileSync(imagePath);
            const imageData = {
                inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType: "image/jpeg", // Multer should ensure this or we can detect
                },
            };

            const prompt = `
        You are a medical assistant. Carefully analyze this medical prescription image.
        Extract the medicines listed and return them in a structured JSON format.
        Include for each medicine:
        - name: The name of the medicine
        - dosage: The dosage (e.g., 500mg, 1 tablet)
        - frequency: How often to take it (e.g., twice a day, 1-0-1)
        - instructions: Specific instructions (e.g., after meals, at bedtime)
        - duration: Total duration of the course (e.g., 5 days, 1 month)
        
        Also extract any additional notes or the doctor's name if visible.
        
        Return ONLY the JSON object in this format:
        {
          "medicines": [
            { "name": "", "dosage": "", "frequency": "", "instructions": "", "duration": "" }
          ],
          "notes": "",
          "doctorName": ""
        }
      `;

            const result = await model.generateContent([prompt, imageData]);
            const response = await result.response;
            const text = response.text();

            // Clean the response text to ensure it's valid JSON
            const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const data = JSON.parse(jsonStr) as PrescriptionData;

            return data;
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw new Error("Failed to analyze prescription image");
        }
    }

    /**
     * Basic drug-drug interaction checker (Mocked logic)
     * @param medicines List of medicine names
     */
    checkInteractions(medicineNames: string[]) {
        const interactions = [
            { drugs: ["Warfarin", "Aspirin"], severity: "High", message: "Increased risk of bleeding." },
            { drugs: ["Sildenafil", "Nitroglycerin"], severity: "Critical", message: "Can cause dangerous drop in blood pressure." },
            { drugs: ["Lisinopril", "Spironolactone"], severity: "Moderate", message: "Risk of high potassium levels." },
            { drugs: ["Atorvastatin", "Clarithromycin"], severity: "Moderate", message: "Increased risk of muscle damage." },
            { drugs: ["Metformin", "Contrast Dye"], severity: "High", message: "Risk of kidney issues." },
        ];

        const results = [];
        const names = medicineNames.map(n => n.toLowerCase());

        for (const interaction of interactions) {
            const detected = interaction.drugs.every(drug =>
                names.some(name => name.includes(drug.toLowerCase()))
            );

            if (detected) {
                results.push(interaction);
            }
        }

        return results;
    }
}

export const aiService = new AIService();
