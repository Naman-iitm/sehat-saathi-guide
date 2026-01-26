import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { Caregiver } from '../models/Caregiver';
import { User } from '../models/User';
import { SOSAlert } from '../models/SOSAlert';
import { asyncHandler } from '../middleware/errorHandler';
import { BadRequestError, NotFoundError } from '../utils/errors';

const router = Router();

/**
 * @route   POST /api/caregivers/invite
 * @desc    Invite a caregiver by email
 * @access  Private (Patient)
 */
router.post('/invite', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, relationship, name, permissions } = req.body;

    if (!req.user) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    const patientId = (req.user as any)._id;

    if (email === req.user.email) {
        throw new BadRequestError("You cannot invite yourself as a caregiver.");
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    // Check if already invited
    const existingLink = await Caregiver.findOne({
        patientId,
        caregiverEmail: email,
    });

    if (existingLink) {
        throw new BadRequestError("Caregiver already added or invited.");
    }

    const invitation = await Caregiver.create({
        patientId,
        caregiverId: existingUser?._id, // Link if user exists
        caregiverEmail: email,
        name: existingUser?.name || name || "Pending Caregiver",
        relationship: relationship || "Family",
        permissions: permissions || {
            canViewSymptoms: true,
            canViewMedicines: true,
            canViewVitals: true,
            canViewAppointments: true,
            canReceiveAlerts: true,
            canReceiveSOS: true,
        },
        status: 'pending'
    });

    // TODO: Send email invitation via EmailService

    res.status(201).json({
        success: true,
        data: invitation,
        message: "Invitation sent successfully."
    });
}));

/**
 * @route   GET /api/caregivers
 * @desc    Get list of my caregivers (for Patient)
 * @access  Private
 */
router.get('/', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new Error("User not found");
    const patientId = (req.user as any)._id;
    const caregivers = await Caregiver.find({ patientId }).populate("caregiverId", "name email phone profilePic");
    res.json({ success: true, data: caregivers });
}));

/**
 * @route   GET /api/caregivers/patients
 * @desc    Get list of patients I care for (for Caregiver)
 * @access  Private
 */
router.get('/patients', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new Error("User not found");
    const caregiverId = (req.user as any)._id;
    const caregiverEmail = req.user.email;

    // Find where I am the caregiver (by ID or Email)
    const records = await Caregiver.find({
        $or: [
            { caregiverId: caregiverId },
            { caregiverEmail: caregiverEmail }
        ],
        status: 'active'
    }).populate('patientId', 'name email phone profilePic');

    res.json({ success: true, data: records });
}));

/**
 * @route   POST /api/caregivers/sos
 * @desc    Trigger SOS alert
 * @access  Private
 */
router.post('/sos', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new Error("User not found");
    const { location } = req.body;
    const patientId = (req.user as any)._id;

    // 1. Log the alert
    const alert = await SOSAlert.create({
        userId: patientId,
        location,
        status: 'active',
        notifiedContacts: []
    });

    // 2. Notify Caregivers 
    const caregivers = await Caregiver.find({
        patientId,
        status: 'active',
        "permissions.canReceiveAlerts": true
    });

    const contacts = caregivers.map(c => c.caregiverEmail);

    // Mock sending SMS/Notifications
    console.log(`[Twilio MOCK] Sending SOS to: ${contacts.join(', ')}`);

    alert.notifiedContacts = contacts;
    await alert.save();

    res.status(201).json({
        success: true,
        data: alert,
        message: "SOS Alert broadcasted to all active caregivers"
    });
}));

export default router;
