import { Router, Response } from 'express';
import { MedicalHistory } from '../models/MedicalHistory';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// Get medical history
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const history = await MedicalHistory.findOne({ userId: (req.user as any)._id });
    res.json(history || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save/Update medical history
router.put('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { bloodGroup, allergies, chronicConditions, surgeries, medications } = req.body;

    const history = await MedicalHistory.findOneAndUpdate(
      { userId: (req.user as any)._id },
      { bloodGroup, allergies, chronicConditions, surgeries, medications, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
