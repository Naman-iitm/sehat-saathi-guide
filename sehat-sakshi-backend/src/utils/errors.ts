/**
 * Custom Error Classes for Sehat Saathi Backend
 * Provides typed errors with appropriate HTTP status codes
 */

/**
 * Base Application Error
 */
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public code?: string;

    constructor(message: string, statusCode: number, code?: string) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error - 400 Bad Request
 * Used when input validation fails
 */
export class ValidationError extends AppError {
    public details?: Record<string, string>[];

    constructor(message: string, details?: Record<string, string>[]) {
        super(message, 400, 'VALIDATION_ERROR');
        this.details = details;
        this.name = 'ValidationError';
    }
}

/**
 * Authentication Error - 401 Unauthorized
 * Used when authentication fails
 */
export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 401, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}

/**
 * Authorization Error - 403 Forbidden
 * Used when user doesn't have permission
 */
export class AuthorizationError extends AppError {
    constructor(message: string = 'Access denied') {
        super(message, 403, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}

/**
 * Not Found Error - 404 Not Found
 * Used when a resource is not found
 */
export class NotFoundError extends AppError {
    public resource?: string;

    constructor(message: string = 'Resource not found', resource?: string) {
        super(message, 404, 'NOT_FOUND_ERROR');
        this.resource = resource;
        this.name = 'NotFoundError';
    }
}

/**
 * Conflict Error - 409 Conflict
 * Used when there's a conflict (e.g., duplicate entry)
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409, 'CONFLICT_ERROR');
        this.name = 'ConflictError';
    }
}

/**
 * Rate Limit Error - 429 Too Many Requests
 * Used when rate limit is exceeded
 */
export class RateLimitError extends AppError {
    public retryAfter?: number;

    constructor(message: string = 'Too many requests', retryAfter?: number) {
        super(message, 429, 'RATE_LIMIT_ERROR');
        this.retryAfter = retryAfter;
        this.name = 'RateLimitError';
    }
}

/**
 * Database Error - 500 Internal Server Error
 * Used for database-related errors
 */
export class DatabaseError extends AppError {
    constructor(message: string = 'Database operation failed') {
        super(message, 500, 'DATABASE_ERROR');
        this.name = 'DatabaseError';
    }
}

/**
 * Internal Server Error - 500 Internal Server Error
 * Used for unexpected server errors
 */
export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(message, 500, 'INTERNAL_SERVER_ERROR');
        this.name = 'InternalServerError';
    }
}

/**
 * Service Unavailable Error - 503 Service Unavailable
 * Used when a service is temporarily unavailable
 */
export class ServiceUnavailableError extends AppError {
    constructor(message: string = 'Service temporarily unavailable') {
        super(message, 503, 'SERVICE_UNAVAILABLE_ERROR');
        this.name = 'ServiceUnavailableError';
    }
}

/**
 * Helper function to check if error is an AppError
 */
export const isAppError = (error: unknown): error is AppError => {
    return error instanceof AppError;
};

/**
 * Helper function to create error from MongoDB errors
 */
export const fromMongoError = (error: any): AppError => {
    // Duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0] || 'field';
        return new ConflictError(`${field} already exists`);
    }

    // Validation error from Mongoose
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors || {}).map(
            (err: any) => err.message
        );
        return new ValidationError(messages.join(', '));
    }

    // Cast error (invalid ObjectId)
    if (error.name === 'CastError') {
        return new ValidationError(`Invalid ${error.path}: ${error.value}`);
    }

    // Default to database error
    return new DatabaseError(error.message);
};

export default {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    DatabaseError,
    InternalServerError,
    ServiceUnavailableError,
    isAppError,
    fromMongoError,
};
