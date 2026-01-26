import { Router, Response } from "express";
import multer from "multer";
import { protect, AuthRequest } from "../middleware/auth";
import { analyzePrescription, checkDrugInteractions } from "../services/aiService";
import { asyncHandler } from "../middleware/errorHandler";
import path from "path";
import fs from "fs";

const router = Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images are allowed!"));
    }
});

// Analyze Prescription
router.post(
    "/analyze-prescription",
    protect,
    upload.single("image"),
    asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.file) {
            res.status(400);
            throw new Error("No image uploaded.");
        }

        try {
            const analysis = await analyzePrescription(req.file.path);

            // Cleanup file after analysis
            fs.unlinkSync(req.file.path);

            res.json({ success: true, data: analysis });
        } catch (error) {
            // Cleanup on error
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            throw error;
        }
    })
);

// Check Interactions
router.post(
    "/check-interactions",
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { medicines } = req.body;
        if (!medicines || !Array.isArray(medicines)) {
            res.status(400);
            throw new Error("Medicines list is required.");
        }

        const interactions = await checkDrugInteractions(medicines);
        res.json({ success: true, data: interactions });
    })
);

export default router;
