import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { getHealthTrends, generateHealthReportData } from '../services/analyticsService';

const router = Router();

/**
 * @route   GET /api/analytics/trends
 * @desc    Get health trends visualization data
 */
router.get('/trends', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const timeframe = req.query.timeframe as 'week' | 'month' | 'year' || 'month';

        const trends = await getHealthTrends(userId, timeframe);
        res.json(trends);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
});

/**
 * @route   GET /api/analytics/report
 * @desc    Get comprehensive data for PDF report generation
 */
router.get('/report', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const reportData = await generateHealthReportData(userId);
        res.json(reportData);
    } catch (error) {
        res.status(500).json({ message: 'Server error generating report data' });
    }
});

export default router;
