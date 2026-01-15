import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../utils/errors';

/**
 * Rate Limiting Configuration
 * Implements rate limiting for different API endpoints
 */

/**
 * Default rate limit options
 */
const defaultOptions = {
    standardHeaders: true,   // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,    // Disable the `X-RateLimit-*` headers
    handler: (_req: any, res: any, _next: any, options: any) => {
        const error = new RateLimitError(
            `Too many requests. Please try again after ${Math.ceil(options.windowMs / 1000 / 60)} minutes.`,
            Math.ceil(options.windowMs / 1000)
        );
        res.status(429).json({
            success: false,
            error: {
                message: error.message,
                code: error.code,
                retryAfter: error.retryAfter,
            },
            timestamp: new Date().toISOString(),
        });
    },
};

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
    ...defaultOptions,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise use IP
        return (req as any).user?.id || req.ip || 'unknown';
    },
});

/**
 * Authentication rate limiter (stricter)
 * 5 login attempts per 15 minutes
 */
export const authLimiter = rateLimit({
    ...defaultOptions,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many authentication attempts, please try again after 15 minutes',
    skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * Registration rate limiter
 * 3 registrations per hour per IP
 */
export const registrationLimiter = rateLimit({
    ...defaultOptions,
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many registrations from this IP, please try again after an hour',
});

/**
 * Password reset rate limiter
 * 3 attempts per 15 minutes
 */
export const passwordResetLimiter = rateLimit({
    ...defaultOptions,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: 'Too many password reset attempts, please try again after 15 minutes',
});

/**
 * API write operations rate limiter
 * 30 writes per minute
 */
export const writeLimiter = rateLimit({
    ...defaultOptions,
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    message: 'Too many write operations, please slow down',
    keyGenerator: (req) => {
        return (req as any).user?.id || req.ip || 'unknown';
    },
});

/**
 * Heavy operations rate limiter (exports, reports)
 * 5 operations per 10 minutes
 */
export const heavyOperationLimiter = rateLimit({
    ...defaultOptions,
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: 'Too many heavy operations, please try again later',
});

/**
 * Create custom rate limiter
 */
export const createRateLimiter = (options: {
    windowMs: number;
    max: number;
    message?: string;
}) => {
    return rateLimit({
        ...defaultOptions,
        ...options,
    });
};

export default {
    generalLimiter,
    authLimiter,
    registrationLimiter,
    passwordResetLimiter,
    writeLimiter,
    heavyOperationLimiter,
    createRateLimiter,
};
