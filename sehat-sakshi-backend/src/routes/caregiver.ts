import { Router, Response } from "express";
import { protect, AuthRequest } from "../middleware/auth";
import { Caregiver } from "../models/Caregiver";
import { User } from "../models/User";
import { SOSAlert } from "../models/SOSAlert";
import { asyncHandler } from "../middleware/errorHandler";
import { BadRequestError, NotFoundError } from "../utils/errors";
// Note: In a real implementation, we would import the initialized socket handler instance here
// to emit real-time events. For this MVP, we focus on the REST API and data structure.

const router = Router();

/**
 * @route   POST /api/caregivers/invite
 * @desc    Invite a caregiver by email
 * @access  Private (Patient)
 */
router.post(
    "/invite",
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { email, relationship, permissions } = req.body;
        const patientId = (req.user as any)._id;

        const caregiverUser = await User.findOne({ email });
        if (!caregiverUser) {
            throw new NotFoundError("User with this email not found", "User");
        }

        if (caregiverUser._id.toString() === patientId.toString()) {
            throw new BadRequestError("You cannot invite yourself");
        }

        const existingLink = await Caregiver.findOne({
            patientId,
            caregiverId: caregiverUser._id,
        });

        if (existingLink) {
            throw new BadRequestError("Caregiver already added or invited");
        }

        const newCaregiver = await Caregiver.create({
            patientId,
            caregiverId: caregiverUser._id,
            relationship,
            permissions,
            status: "pending", // Caregiver must accept
        });

        res.status(201).json({
            success: true,
            data: newCaregiver,
            message: "Invitation sent successfully",
        });
    })
);

/**
 * @route   GET /api/caregivers
 * @desc    Get list of my caregivers (for Patient)
 * @access  Private
 */
router.get(
    "/",
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const patientId = (req.user as any)._id;
        const caregivers = await Caregiver.find({ patientId }).populate("caregiverId", "name email phone profilePic");

        res.json({ success: true, data: caregivers });
    })
);

/**
 * @route   GET /api/caregivers/patients
 * @desc    Get list of patients I care for (for Caregiver)
 * @access  Private
 */
router.get(
    "/patients",
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const caregiverId = (req.user as any)._id;
        const patients = await Caregiver.find({
            caregiverId,
            status: "active"
        }).populate("patientId", "name email phone profilePic");

        res.json({ success: true, data: patients });
    })
);

/**
 * @route   POST /api/caregivers/sos
 * @desc    Trigger SOS alert
 * @access  Private
 */
router.post(
    "/sos",
    protect,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { location } = req.body;
        const patientId = (req.user as any)._id;

        // 1. Create Alert
        const alert = await SOSAlert.create({
            userId: patientId,
            location,
            status: "active",
        });

        // 2. Notify Caregivers (Logic should use Twilio/Socket here)
        // For MVP, we just fetch them to show we know who to notify
        const caregivers = await Caregiver.find({
            patientId,
            status: "active",
            "permissions.canReceiveAlerts": true
        }).populate("caregiverId", "phone");

        // Mock Twilio SMS sending
        caregivers.forEach(c => {
            console.log(`[MOCK SMS] To ${(c.caregiverId as any).phone}: SOS! Patient needs help at ${location?.latitude}, ${location?.longitude}`);
        });

        res.status(201).json({
            success: true,
            data: alert,
            message: "SOS Alert broadcasted to all active caregivers",
        });
    })
);

export default router;
