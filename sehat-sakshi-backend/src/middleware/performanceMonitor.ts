import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { SlowRequestLog, PerformanceMetrics } from '../types/logger.types';

// Configuration
const SLOW_REQUEST_THRESHOLD = parseInt(process.env.SLOW_REQUEST_THRESHOLD || '100', 10); // ms

// In-memory metrics storage
interface MetricsStore {
    requestCount: number;
    totalResponseTime: number;
    slowRequestCount: number;
    errorCount: number;
    endpointMetrics: Map<string, EndpointMetrics>;
    startTime: number;
}

interface EndpointMetrics {
    count: number;
    totalTime: number;
    maxTime: number;
    errorCount: number;
}

const metricsStore: MetricsStore = {
    requestCount: 0,
    totalResponseTime: 0,
    slowRequestCount: 0,
    errorCount: 0,
    endpointMetrics: new Map(),
    startTime: Date.now(),
};

/**
 * Get endpoint key for metrics grouping
 */
const getEndpointKey = (method: string, url: string): string => {
    // Normalize URL by removing query params and IDs
    const normalizedUrl = url
        .split('?')[0]
        .replace(/\/[0-9a-fA-F]{24}/g, '/:id') // MongoDB ObjectId
        .replace(/\/\d+/g, '/:id'); // Numeric IDs

    return `${method} ${normalizedUrl}`;
};

/**
 * Update endpoint metrics
 */
const updateEndpointMetrics = (
    method: string,
    url: string,
    duration: number,
    isError: boolean
): void => {
    const key = getEndpointKey(method, url);
    const existing = metricsStore.endpointMetrics.get(key) || {
        count: 0,
        totalTime: 0,
        maxTime: 0,
        errorCount: 0,
    };

    existing.count += 1;
    existing.totalTime += duration;
    existing.maxTime = Math.max(existing.maxTime, duration);
    if (isError) {
        existing.errorCount += 1;
    }

    metricsStore.endpointMetrics.set(key, existing);
};

/**
 * Performance Monitor Middleware
 * Tracks response times and identifies slow requests
 */
export const performanceMonitor = (req: Request, res: Response, next: NextFunction): void => {
    // Ensure start time is set
    if (!req.startTime) {
        req.startTime = Date.now();
    }

    // Capture original end method
    const originalEnd = res.end;

    // Override end method to track performance
    res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
        const duration = req.startTime ? Date.now() - req.startTime : 0;
        const isError = res.statusCode >= 400;

        // Update global metrics
        metricsStore.requestCount += 1;
        metricsStore.totalResponseTime += duration;

        if (isError) {
            metricsStore.errorCount += 1;
        }

        // Check for slow request
        if (duration > SLOW_REQUEST_THRESHOLD) {
            metricsStore.slowRequestCount += 1;

            const slowRequestLog: SlowRequestLog = {
                requestId: req.id || 'unknown',
                method: req.method,
                url: req.originalUrl || req.url,
                duration,
                threshold: SLOW_REQUEST_THRESHOLD,
                timestamp: new Date().toISOString(),
            };

            logger.warn(`Slow request detected: ${req.method} ${req.originalUrl} took ${duration}ms`, {
                type: 'slow_request',
                ...slowRequestLog,
            });
        }

        // Update endpoint-specific metrics
        updateEndpointMetrics(req.method, req.originalUrl || req.url, duration, isError);

        // Call original end method
        return originalEnd.call(this, chunk, encoding, callback);
    };

    next();
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetrics => {
    const averageResponseTime = metricsStore.requestCount > 0
        ? Math.round(metricsStore.totalResponseTime / metricsStore.requestCount)
        : 0;

    return {
        uptime: Math.floor((Date.now() - metricsStore.startTime) / 1000),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        requestCount: metricsStore.requestCount,
        averageResponseTime,
        slowRequestCount: metricsStore.slowRequestCount,
        errorCount: metricsStore.errorCount,
        timestamp: new Date().toISOString(),
    };
};

/**
 * Get endpoint-specific metrics
 */
export const getEndpointMetrics = (): Record<string, EndpointMetrics & { averageTime: number }> => {
    const result: Record<string, EndpointMetrics & { averageTime: number }> = {};

    metricsStore.endpointMetrics.forEach((metrics, key) => {
        result[key] = {
            ...metrics,
            averageTime: metrics.count > 0 ? Math.round(metrics.totalTime / metrics.count) : 0,
        };
    });

    return result;
};

/**
 * Reset metrics (useful for testing)
 */
export const resetMetrics = (): void => {
    metricsStore.requestCount = 0;
    metricsStore.totalResponseTime = 0;
    metricsStore.slowRequestCount = 0;
    metricsStore.errorCount = 0;
    metricsStore.endpointMetrics.clear();
    metricsStore.startTime = Date.now();
};

export default performanceMonitor;
