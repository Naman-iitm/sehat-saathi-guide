import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import {
    getHealthTrends,
    generateHealthReportData,
    getSymptomAnalytics,
    getAdherenceAnalytics,
    getHealthScore
} from '../services/analyticsService';

const router = Router();

/**
 * @route   GET /api/analytics/trends
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
 * @route   GET /api/analytics/symptoms
 */
router.get('/symptoms', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const timeframe = req.query.timeframe as string || 'month';
        const data = await getSymptomAnalytics(userId, timeframe);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching symptom analytics' });
    }
});

/**
 * @route   GET /api/analytics/adherence
 */
router.get('/adherence', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const timeframe = req.query.timeframe as string || 'month';
        const data = await getAdherenceAnalytics(userId, timeframe);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching adherence analytics' });
    }
});

/**
 * @route   GET /api/analytics/health-score
 */
router.get('/health-score', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const data = await getHealthScore(userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching health score' });
    }
});

/**
 * @route   GET /api/analytics/report
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
