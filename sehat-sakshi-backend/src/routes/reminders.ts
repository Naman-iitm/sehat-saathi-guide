import { Router, Response } from 'express';
import { Reminder } from '../models/Reminder';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all reminders
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const reminders = await Reminder.find({ userId: (req.user as any)._id }).sort({ date: 1, time: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create reminder
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, date, time, recurrence, dosage, enabled } = req.body;

    const reminder = await Reminder.create({
      userId: (req.user as any)._id,
      title,
      type,
      date,
      time,
      recurrence,
      dosage,
      enabled,
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reminder
router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: (req.user as any)._id },
      req.body,
      { new: true }
    );
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    await Reminder.findOneAndDelete({ _id: req.params.id, userId: (req.user as any)._id });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Log reminder activity (taken/skipped)
router.post('/:id/log', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body; // 'taken' | 'skipped'
    const userId = (req.user as any)._id;
    const reminderId = req.params.id;

    const ReminderLog = (await import('../models/ReminderLog')).ReminderLog;

    const log = await ReminderLog.create({
      userId,
      reminderId,
      status,
      takenAt: new Date()
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Reminder log error:', error);
    res.status(500).json({ message: 'Server error logging reminder' });
  }
});

export default router;
