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

// Snooze reminder
router.patch('/:id/snooze', protect, async (req: AuthRequest, res: Response) => {
  try {
    const duration = req.body.duration || 10; // Default 10 minutes
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: (req.user as any)._id });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    const now = new Date();
    // Use the reminder's scheduled time but for "today" + duration
    // Actually, snooze usually means "remind me in X minutes from now"
    const targetTime = new Date(now.getTime() + duration * 60000);

    const hours = targetTime.getHours().toString().padStart(2, '0');
    const minutes = targetTime.getMinutes().toString().padStart(2, '0');

    reminder.time = `${hours}:${minutes}`;
    // If it was a 'once' reminder for a past date, update to today's date so it triggers
    reminder.date = targetTime.toISOString().split('T')[0];

    await reminder.save();
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
