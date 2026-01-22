import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect, AuthRequest } from "../middleware/auth";
import { aiService } from "../services/aiService";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// Configure Multer for prescription image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../../uploads/prescriptions");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `prescription-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
    },
});

/**
 * @route   POST /api/ai/analyze-prescription
 * @desc    Upload prescription image and extract medicine data
 * @access  Private
 */
router.post(
    "/analyze-prescription",
    protect,
    upload.single("prescription"),
    asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file uploaded" });
        }

        try {
            // 1. OCR analysis via Gemini
            const prescriptionData = await aiService.analyzePrescription(req.file.path);

            // 2. Check for drug-drug interactions
            const medicineNames = prescriptionData.medicines.map(m => m.name);
            const interactions = aiService.checkInteractions(medicineNames);

            // 3. Cleanup: Delete the file after processing to save space (optional, based on privacy)
            // fs.unlinkSync(req.file.path);

            res.status(200).json({
                success: true,
                data: {
                    ...prescriptionData,
                    interactions,
                    imageUrl: `/uploads/prescriptions/${path.basename(req.file.path)}`
                },
            });
        } catch (error: any) {
            console.error("Prescription analysis error:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to analyze prescription"
            });
        }
    })
);

export default router;
