import { Router, Response } from 'express';
import { Notification } from '../models/Notification';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for user
 */
router.get('/', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 to avoid overload

        const unreadCount = await Notification.countDocuments({
            user: userId,
            isRead: false
        });

        res.json({
            notifications,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a notification as read
 */
router.put('/:id/read', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: userId },
            { isRead: true },
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

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 */
router.put('/read-all', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        await Notification.updateMany(
            { user: userId, isRead: false },
            { isRead: true }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   DELETE /api/notifications
 * @desc    Clear all notifications for user
 */
router.delete('/', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        await Notification.deleteMany({ user: userId });
        res.json({ message: 'All notifications cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
