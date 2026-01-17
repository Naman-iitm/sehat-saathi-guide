import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, isAppError, fromMongoError } from '../utils/errors';

/**
 * Error Response Interface
 */
interface ErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
        details?: Record<string, string>[];
        stack?: string;
    };
    requestId?: string;
    timestamp: string;
}

/**
 * Sanitize error message for production
 * Removes sensitive information from error messages
 */
const sanitizeErrorMessage = (message: string): string => {
    // Remove potential sensitive data patterns
    const sensitivePatterns = [
        /password[:\s]+"[^"]+"/gi,
        /token[:\s]+"[^"]+"/gi,
        /authorization[:\s]+"[^"]+"/gi,
        /apikey[:\s]+"[^"]+"/gi,
        /secret[:\s]+"[^"]+"/gi,
    ];

    let sanitized = message;
    sensitivePatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    return sanitized;
};

/**
 * Format error for response
 */
const formatError = (
    error: AppError | Error,
    req: Request,
    isDevelopment: boolean
): ErrorResponse => {
    const isOperational = isAppError(error) && error.isOperational;

    const response: ErrorResponse = {
        success: false,
        error: {
            message: isDevelopment || isOperational
                ? sanitizeErrorMessage(error.message)
                : 'An unexpected error occurred',
            code: isAppError(error) ? error.code : 'INTERNAL_ERROR',
        },
        requestId: req.id,
        timestamp: new Date().toISOString(),
    };

    // Add validation details if present
    if (error instanceof ValidationError && error.details) {
        response.error.details = error.details;
    }

    // Add stack trace in development
    if (isDevelopment && error.stack) {
        response.error.stack = error.stack;
    }

    return response;
};

/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent error response
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // Convert MongoDB errors to AppError
    let error: AppError | Error = err;
    if (err.name === 'MongoError' || err.name === 'MongoServerError' ||
        err.name === 'ValidationError' || err.name === 'CastError') {
        error = fromMongoError(err);
    }

    // Get status code
    const statusCode = isAppError(error) ? error.statusCode : 500;

    // Log error (in production, you'd want more sophisticated logging)
    if (statusCode >= 500) {
        console.error(`[ERROR] ${req.method} ${req.originalUrl}`, {
            requestId: req.id,
            statusCode,
            message: err.message,
            stack: err.stack,
        });
    } else if (isDevelopment) {
        console.warn(`[WARN] ${req.method} ${req.originalUrl}`, {
            requestId: req.id,
            statusCode,
            message: err.message,
        });
    }

    // Send error response
    const errorResponse = formatError(error, req, isDevelopment);
    res.status(statusCode).json(errorResponse);
};

/**
 * Not Found Handler Middleware
 * Catches requests to undefined routes
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const errorResponse: ErrorResponse = {
        success: false,
        error: {
            message: `Route ${req.method} ${req.originalUrl} not found`,
            code: 'ROUTE_NOT_FOUND',
        },
        requestId: req.id,
        timestamp: new Date().toISOString(),
    };

    res.status(404).json(errorResponse);
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default {
    errorHandler,
    notFoundHandler,
    asyncHandler,
};
