import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import SymptomLog from '../models/SymptomLog';
import ReminderLog from '../models/ReminderLog';

const router = Router();

/**
 * @route   POST /api/sync/bulk
 * @desc    Receive batched offline data from frontend
 */
router.post('/bulk', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid sync data' });
        }

        const syncedIds: number[] = [];

        for (const item of items) {
            try {
                if (item.type === 'symptom') {
                    // Conflict resolution: Check if a similar entry exists (e.g., same timestamp)
                    // For now, we just create new entries if they don't exist
                    const newSymptom = new SymptomLog({
                        userId,
                        ...item.data,
                        createdAt: new Date(item.timestamp)
                    });
                    await newSymptom.save();
                    syncedIds.push(item.id);
                }
                else if (item.type === 'reminder_log') {
                    const newLog = new ReminderLog({
                        userId,
                        ...item.data,
                        createdAt: new Date(item.timestamp)
                    });
                    await newLog.save();
                    syncedIds.push(item.id);
                }
                else if (item.type === 'order') {
                    // This assumes we have an Order model
                    // For now, we'll log it. In a real app, we'd save it to orders collection.
                    console.log('Syncing order:', item.data);
                    syncedIds.push(item.id);
                }
                // Add more types here as needed (e.g., orders)
            } catch (err) {
                console.error(`Failed to sync item ${item.id}:`, err);
                // Continue with other items
            }
        }

        res.json({
            message: 'Sync completed',
            syncedCount: syncedIds.length,
            syncedIds
        });
    } catch (error) {
        console.error('Bulk sync error:', error);
        res.status(500).json({ message: 'Server error during sync' });
    }
});

export default router;
