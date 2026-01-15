import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { getPerformanceMetrics, getEndpointMetrics } from '../middleware/performanceMonitor';
import logger from '../config/logger';
import os from 'os';

const router = Router();

/**
 * @route   GET /api/metrics
 * @desc    Get API performance metrics (protected)
 * @access  Private
 */
router.get('/', protect, async (req: AuthRequest, res: Response) => {
    try {
        const metrics = getPerformanceMetrics();

        logger.debug('Metrics endpoint accessed', {
            requestId: req.id,
            userId: (req.user as any)?._id,
        });

        res.json({
            success: true,
            data: metrics,
        });
    } catch (error) {
        logger.error('Error fetching metrics', { error });
        res.status(500).json({
            success: false,
            error: 'Failed to fetch metrics',
        });
    }
});

/**
 * @route   GET /api/metrics/endpoints
 * @desc    Get endpoint-specific metrics (protected)
 * @access  Private
 */
router.get('/endpoints', protect, async (req: AuthRequest, res: Response) => {
    try {
        const endpointMetrics = getEndpointMetrics();

        // Sort by request count descending
        const sorted = Object.entries(endpointMetrics)
            .sort(([, a], [, b]) => b.count - a.count)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {} as typeof endpointMetrics);

        res.json({
            success: true,
            data: sorted,
        });
    } catch (error) {
        logger.error('Error fetching endpoint metrics', { error });
        res.status(500).json({
            success: false,
            error: 'Failed to fetch endpoint metrics',
        });
    }
});

/**
 * @route   GET /api/metrics/system
 * @desc    Get system-level metrics (protected)
 * @access  Private
 */
router.get('/system', protect, async (req: AuthRequest, res: Response) => {
    try {
        const systemMetrics = {
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: process.version,
            uptime: {
                system: os.uptime(),
                process: process.uptime(),
            },
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem(),
                usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2),
                process: process.memoryUsage(),
            },
            cpu: {
                cores: os.cpus().length,
                model: os.cpus()[0]?.model,
                loadAverage: os.loadavg(),
                process: process.cpuUsage(),
            },
            timestamp: new Date().toISOString(),
        };

        res.json({
            success: true,
            data: systemMetrics,
        });
    } catch (error) {
        logger.error('Error fetching system metrics', { error });
        res.status(500).json({
            success: false,
            error: 'Failed to fetch system metrics',
        });
    }
});

/**
 * @route   GET /api/metrics/health
 * @desc    Detailed health check with metrics
 * @access  Public
 */
router.get('/health', async (_req, res: Response) => {
    try {
        const metrics = getPerformanceMetrics();
        const memUsage = process.memoryUsage();

        // Define health thresholds
        const isHealthy =
            memUsage.heapUsed < memUsage.heapTotal * 0.9 && // Memory under 90%
            metrics.errorCount < metrics.requestCount * 0.1; // Error rate under 10%

        const healthData = {
            status: isHealthy ? 'healthy' : 'degraded',
            uptime: metrics.uptime,
            memory: {
                heapUsed: memUsage.heapUsed,
                heapTotal: memUsage.heapTotal,
                usagePercent: ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(2),
            },
            requests: {
                total: metrics.requestCount,
                averageResponseTime: metrics.averageResponseTime,
                slowRequests: metrics.slowRequestCount,
                errors: metrics.errorCount,
                errorRate: metrics.requestCount > 0
                    ? ((metrics.errorCount / metrics.requestCount) * 100).toFixed(2)
                    : '0',
            },
            timestamp: new Date().toISOString(),
        };

        res.status(isHealthy ? 200 : 503).json({
            success: true,
            data: healthData,
        });
    } catch (error) {
        logger.error('Error in health check', { error });
        res.status(500).json({
            success: false,
            status: 'error',
            error: 'Health check failed',
        });
    }
});

export default router;
