import { Router, Response } from 'express';
import { Notification } from '../models/Notification';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all notifications for the authenticated user
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { status, limit = 50, page = 1 } = req.query;

    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .populate('reminderId', 'title type');

    const total = await Notification.countDocuments(query);

    res.json({
      notifications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread notification count
router.get('/unread-count', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const count = await Notification.countDocuments({
      userId,
      status: 'sent',
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read (must be before parameterized routes)
router.patch('/read-all', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const result = await Notification.updateMany(
      { userId, status: 'sent' },
      { status: 'read', readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read', count: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { status: 'read', readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as dismissed
router.patch('/:id/dismiss', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { status: 'dismissed', dismissedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Snooze notification
router.patch('/:id/snooze', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { minutes = 15 } = req.body;

    const snoozedUntil = new Date();
    snoozedUntil.setMinutes(snoozedUntil.getMinutes() + minutes);

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { status: 'snoozed', snoozedUntil },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notification
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
