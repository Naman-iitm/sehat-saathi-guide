import { Router, Response } from 'express';
import { SymptomLog } from '../models/SymptomLog';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// Get symptom logs
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const logs = await SymptomLog.find({ userId: (req.user as any)._id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create symptom log
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { symptoms, severity, notes, triageResult } = req.body;

    const log = await SymptomLog.create({
      userId: (req.user as any)._id,
      symptoms,
      severity,
      notes,
      triageResult,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete symptom log
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    await SymptomLog.findOneAndDelete({ _id: req.params.id, userId: (req.user as any)._id });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
