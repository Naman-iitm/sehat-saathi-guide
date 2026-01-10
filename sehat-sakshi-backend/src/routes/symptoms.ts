import { Router, Response } from 'express';
import { SymptomLog } from '../models/SymptomLog';
import { protect, AuthRequest, getUserId } from '../middleware/auth';

const router = Router();

// Get symptom logs
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const logs = await SymptomLog.find({ userId: getUserId(req) }).sort({ createdAt: -1 });
    res.json(logs);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create symptom log
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { symptoms, severity, notes, triageResult } = req.body;

    const log = await SymptomLog.create({
      userId: getUserId(req),
      symptoms,
      severity,
      notes,
      triageResult,
    });

    res.status(201).json(log);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete symptom log
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    await SymptomLog.findOneAndDelete({ _id: req.params.id, userId: getUserId(req) });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
