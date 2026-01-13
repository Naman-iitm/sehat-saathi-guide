import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { getOrCreateRequestId } from '../utils/requestId';
import { RequestLogData, ResponseLogData } from '../types/logger.types';

// List of sensitive fields to sanitize
const SENSITIVE_FIELDS = ['password', 'token', 'authorization', 'cookie', 'secret', 'apiKey', 'accessToken', 'refreshToken'];

/**
 * Sanitizes an object by removing sensitive fields
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
const sanitizeObject = (obj: Record<string, unknown> | undefined): Record<string, unknown> | undefined => {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();

        if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field.toLowerCase()))) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value as Record<string, unknown>);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
};

/**
 * Extracts client IP address from request
 * @param req - Express request object
 * @returns Client IP address
 */
const getClientIp = (req: Request): string => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
};

/**
 * Request Logger Middleware
 * Logs incoming requests and outgoing responses with timing
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    // Generate or extract request ID
    const requestId = getOrCreateRequestId(req.headers as Record<string, string | string[] | undefined>);
    req.id = requestId;
    req.startTime = Date.now();

    // Set request ID in response header for client tracking
    res.setHeader('X-Request-ID', requestId);

    // Get user ID if authenticated
    const userId = (req as any).user?.id || (req as any).user?._id;

    // Create request log data
    const requestLogData: RequestLogData = {
        requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        ip: getClientIp(req),
        userId: userId?.toString(),
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString(),
    };

    // Add sanitized body for non-GET requests
    if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
        requestLogData.body = sanitizeObject(req.body);
    }

    // Add query params if present
    if (req.query && Object.keys(req.query).length > 0) {
        requestLogData.query = req.query as Record<string, unknown>;
    }

    // Log incoming request
    logger.http(`Incoming ${req.method} ${req.originalUrl}`, { type: 'request', ...requestLogData });

    // Capture original end method
    const originalEnd = res.end;

    // Override end method to log response
    res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
        // Calculate response time
        const duration = req.startTime ? Date.now() - req.startTime : 0;

        // Get content length
        const contentLength = res.getHeader('content-length');

        // Create response log data
        const responseLogData: ResponseLogData = {
            requestId,
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode: res.statusCode,
            duration,
            contentLength: typeof contentLength === 'number' ? contentLength :
                typeof contentLength === 'string' ? parseInt(contentLength, 10) : undefined,
            timestamp: new Date().toISOString(),
        };

        // Determine log level based on status code
        const logLevel = res.statusCode >= 500 ? 'error' :
            res.statusCode >= 400 ? 'warn' : 'http';

        // Log response
        logger.log(logLevel, `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
            { type: 'response', ...responseLogData }
        );

        // Call original end method
        return originalEnd.call(this, chunk, encoding, callback);
    };

    next();
};

/**
 * Skip logging for specific paths (health checks, static files, etc.)
 */
export const shouldSkipLogging = (req: Request): boolean => {
    const skipPaths = ['/health', '/favicon.ico', '/robots.txt'];
    return skipPaths.some(path => req.originalUrl.startsWith(path));
};

/**
 * Conditional request logger that skips certain paths
 */
export const conditionalRequestLogger = (req: Request, res: Response, next: NextFunction): void => {
    if (shouldSkipLogging(req)) {
        return next();
    }
    return requestLogger(req, res, next);
};

export default requestLogger;
