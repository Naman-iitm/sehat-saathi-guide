import { Router, Response } from "express";
import { protect, AuthRequest } from "../middleware/auth";
import { predictiveService } from "../services/predictiveService";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

/**
 * @route   GET /api/prediction
 * @desc    Get AI-driven health predictions
 * @access  Private
 */
router.get(
    "/",
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) throw new Error("User not found");
        const userId = (req.user as any)._id;
        const prediction = await predictiveService.generatePrediction(userId);

        res.json({
            success: true,
            data: prediction,
        });
    })
);

export default router;
