import Joi from 'joi';
import { patterns } from '../middleware/validation';

/**
 * Contact Form Validation Schemas
 * Validation schemas for contact-related endpoints
 */

/**
 * Subject types enum
 */
const subjectEnum = ['support', 'bug', 'feedback', 'partnership', 'other'];

/**
 * Contact status enum
 */
const statusEnum = ['pending', 'in_progress', 'resolved', 'closed'];

/**
 * Create contact message validation schema
 */
export const createContactSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name must not exceed 100 characters',
            'any.required': 'Name is required',
        }),
    email: patterns.email.required().messages({
        'any.required': 'Email is required',
    }),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .allow('')
        .messages({
            'string.pattern.base': 'Please provide a valid 10-digit phone number',
        }),
    subject: Joi.string()
        .valid(...subjectEnum)
        .required()
        .messages({
            'any.only': `Subject must be one of: ${subjectEnum.join(', ')}`,
            'any.required': 'Subject is required',
        }),
    message: Joi.string()
        .min(10)
        .max(2000)
        .trim()
        .required()
        .messages({
            'string.min': 'Message must be at least 10 characters',
            'string.max': 'Message must not exceed 2000 characters',
            'any.required': 'Message is required',
        }),
    // Honeypot field - should be empty for real submissions
    website: Joi.string().max(0).optional().allow('').messages({
        'string.max': 'Invalid submission',
    }),
});

/**
 * Contact reference ID param validation
 */
export const contactReferenceParam = Joi.object({
    referenceId: Joi.string()
        .pattern(/^SS-[A-Z0-9]+-[A-Z0-9]+$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid reference ID format',
            'any.required': 'Reference ID is required',
        }),
});

/**
 * Update contact status validation schema (for admin)
 */
export const updateContactStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...statusEnum)
        .required()
        .messages({
            'any.only': `Status must be one of: ${statusEnum.join(', ')}`,
            'any.required': 'Status is required',
        }),
    adminNotes: Joi.string().max(1000).trim().optional().allow(''),
});

/**
 * Query contacts validation schema (for admin)
 */
export const queryContactsSchema = Joi.object({
    status: Joi.string().valid(...statusEnum).optional(),
    subject: Joi.string().valid(...subjectEnum).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
        'date.min': 'End date must be after start date',
    }),
    email: Joi.string().email().optional(),
    limit: Joi.number().integer().min(1).max(100).default(20).optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
    sort: Joi.string()
        .valid('createdAt', '-createdAt', 'status', '-status')
        .default('-createdAt')
        .optional(),
});

export default {
    createContactSchema,
    contactReferenceParam,
    updateContactStatusSchema,
    queryContactsSchema,
};
