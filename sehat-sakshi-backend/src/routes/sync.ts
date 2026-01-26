import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { SymptomLog } from '../models/SymptomLog';
import { Reminder } from '../models/Reminder';
import { ReminderLog } from '../models/ReminderLog';
import { Order } from '../models/Order';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/sync/bulk
 * @desc    Receive batched offline data from frontend
 */
router.post('/bulk', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    const userId = (req.user as any)._id;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
        res.status(400);
        throw new Error("Invalid sync data format. 'items' array is required.");
    }

    const results = {
        success: 0,
        failed: 0,
        syncedIds: [] as any[],
        errors: [] as any[]
    };

    for (const item of items) {
        try {
            const timestamp = item.timestamp || item.data?.createdAt || new Date();

            switch (item.type) {
                case 'symptom':
                    await SymptomLog.create({
                        ...item.data,
                        userId,
                        createdAt: new Date(timestamp)
                    });
                    break;

                case 'reminder_log':
                    await ReminderLog.create({
                        ...item.data,
                        userId,
                        takenAt: item.data?.takenAt || new Date(timestamp)
                    });
                    break;

                case 'order':
                    await Order.create({
                        ...item.data,
                        userId,
                        status: 'pending',
                        paymentStatus: 'pending',
                        createdAt: item.data?.createdAt || new Date(timestamp)
                    });
                    break;

                default:
                    console.warn(`Unknown sync item type: ${item.type}`);
                    continue; // Skip tracked IDs for unknown types
            }
            results.success++;
            results.syncedIds.push(item.id);
        } catch (error: any) {
            console.error(`Sync failed for item ${item.id}:`, error);
            results.failed++;
            results.errors.push({ id: item.id, error: error.message });
        }
    }

    res.json({
        success: true,
        message: `Synced ${results.success} items. Failed: ${results.failed}`,
        syncedCount: results.success,
        syncedIds: results.syncedIds,
        results
    });
}));

export default router;
