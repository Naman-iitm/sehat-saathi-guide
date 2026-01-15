import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';

/**
 * Validation Source - where to look for data
 */
type ValidationSource = 'body' | 'query' | 'params';

/**
 * Validation Options
 */
interface ValidationOptions {
    abortEarly?: boolean;
    stripUnknown?: boolean;
}

/**
 * Default validation options
 */
const defaultOptions: ValidationOptions = {
    abortEarly: false,     // Collect all errors, not just the first
    stripUnknown: true,    // Remove unknown keys from objects
};

/**
 * Format Joi validation errors
 */
const formatJoiErrors = (error: Joi.ValidationError): Record<string, string>[] => {
    return error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
        type: detail.type,
    }));
};

/**
 * Create validation middleware for a specific source
 */
export const validate = (
    schema: Joi.ObjectSchema,
    source: ValidationSource = 'body',
    options: ValidationOptions = {}
) => {
    const opts = { ...defaultOptions, ...options };

    return (req: Request, _res: Response, next: NextFunction) => {
        const dataToValidate = req[source];

        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: opts.abortEarly,
            stripUnknown: opts.stripUnknown,
            errors: {
                wrap: {
                    label: false,
                },
            },
        });

        if (error) {
            const details = formatJoiErrors(error);
            const message = details.map(d => d.message).join('; ');
            return next(new ValidationError(message, details));
        }

        // Replace the source data with validated/sanitized data
        req[source] = value;
        next();
    };
};

/**
 * Validate request body
 */
export const validateBody = (schema: Joi.ObjectSchema, options?: ValidationOptions) => {
    return validate(schema, 'body', options);
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema, options?: ValidationOptions) => {
    return validate(schema, 'query', options);
};

/**
 * Validate route parameters
 */
export const validateParams = (schema: Joi.ObjectSchema, options?: ValidationOptions) => {
    return validate(schema, 'params', options);
};

/**
 * Combined validation for multiple sources
 */
export const validateRequest = (schemas: {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
}, options?: ValidationOptions) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const middlewares: ((req: Request, res: Response, next: NextFunction) => void)[] = [];

        if (schemas.params) {
            middlewares.push(validate(schemas.params, 'params', options));
        }
        if (schemas.query) {
            middlewares.push(validate(schemas.query, 'query', options));
        }
        if (schemas.body) {
            middlewares.push(validate(schemas.body, 'body', options));
        }

        // Execute middlewares sequentially
        const executeMiddlewares = (index: number) => {
            if (index >= middlewares.length) {
                return next();
            }
            middlewares[index](req, res, (err) => {
                if (err) return next(err);
                executeMiddlewares(index + 1);
            });
        };

        executeMiddlewares(0);
    };
};

/**
 * Common validation patterns
 */
export const patterns = {
    objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
        'string.pattern.base': 'Invalid ID format',
    }),
    email: Joi.string().email().lowercase().trim().messages({
        'string.email': 'Please provide a valid email address',
    }),
    password: Joi.string().min(8).max(128).messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must not exceed 128 characters',
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).messages({
        'string.pattern.base': 'Please provide a valid 10-digit phone number',
    }),
    name: Joi.string().min(2).max(50).trim().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must not exceed 50 characters',
    }),
    url: Joi.string().uri().messages({
        'string.uri': 'Please provide a valid URL',
    }),
};

export default {
    validate,
    validateBody,
    validateQuery,
    validateParams,
    validateRequest,
    patterns,
};
