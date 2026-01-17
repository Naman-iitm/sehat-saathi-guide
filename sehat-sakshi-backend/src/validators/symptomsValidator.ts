import Joi from 'joi';
import { patterns } from '../middleware/validation';

/**
 * Symptoms Validation Schemas
 * Validation schemas for symptom-related endpoints
 */

/**
 * Symptom severity enum
 */
const severityEnum = ['low', 'medium', 'high', 'critical'];

/**
 * Single symptom schema
 */
const symptomItemSchema = Joi.object({
    name: Joi.string().min(2).max(100).trim().required().messages({
        'string.min': 'Symptom name must be at least 2 characters',
        'string.max': 'Symptom name must not exceed 100 characters',
        'any.required': 'Symptom name is required',
    }),
    description: Joi.string().max(500).trim().optional().allow('').messages({
        'string.max': 'Description must not exceed 500 characters',
    }),
    duration: Joi.string().max(100).optional().messages({
        'string.max': 'Duration must not exceed 100 characters',
    }),
    intensity: Joi.number().min(1).max(10).optional().messages({
        'number.min': 'Intensity must be at least 1',
        'number.max': 'Intensity must not exceed 10',
    }),
});

/**
 * Create symptom log validation schema
 */
export const createSymptomLogSchema = Joi.object({
    symptoms: Joi.array()
        .items(Joi.alternatives().try(
            Joi.string().min(2).max(100).trim(),
            symptomItemSchema
        ))
        .min(1)
        .max(20)
        .required()
        .messages({
            'array.min': 'At least one symptom is required',
            'array.max': 'Cannot log more than 20 symptoms at once',
            'any.required': 'Symptoms are required',
        }),
    severity: Joi.string()
        .valid(...severityEnum)
        .optional()
        .messages({
            'any.only': `Severity must be one of: ${severityEnum.join(', ')}`,
        }),
    notes: Joi.string().max(1000).trim().optional().allow('').messages({
        'string.max': 'Notes must not exceed 1000 characters',
    }),
    triageResult: Joi.object({
        severity: Joi.string().valid(...severityEnum).optional(),
        message: Joi.string().max(500).optional(),
        recommendedAction: Joi.string().max(500).optional(),
    }).optional(),
    date: Joi.date().iso().optional().messages({
        'date.format': 'Date must be a valid ISO date',
    }),
});

/**
 * Update symptom log validation schema
 */
export const updateSymptomLogSchema = Joi.object({
    symptoms: Joi.array()
        .items(Joi.alternatives().try(
            Joi.string().min(2).max(100).trim(),
            symptomItemSchema
        ))
        .min(1)
        .max(20)
        .optional()
        .messages({
            'array.min': 'At least one symptom is required',
            'array.max': 'Cannot log more than 20 symptoms at once',
        }),
    severity: Joi.string()
        .valid(...severityEnum)
        .optional()
        .messages({
            'any.only': `Severity must be one of: ${severityEnum.join(', ')}`,
        }),
    notes: Joi.string().max(1000).trim().optional().allow('').messages({
        'string.max': 'Notes must not exceed 1000 characters',
    }),
    triageResult: Joi.object({
        severity: Joi.string().valid(...severityEnum).optional(),
        message: Joi.string().max(500).optional(),
        recommendedAction: Joi.string().max(500).optional(),
    }).optional(),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

/**
 * Symptom log ID param validation
 */
export const symptomLogIdParam = Joi.object({
    id: patterns.objectId.required().messages({
        'any.required': 'Symptom log ID is required',
    }),
});

/**
 * Query symptoms validation schema
 */
export const querySymptomsSchema = Joi.object({
    severity: Joi.string().valid(...severityEnum).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
        'date.min': 'End date must be after start date',
    }),
    limit: Joi.number().integer().min(1).max(100).default(50).optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
    sort: Joi.string().valid('createdAt', '-createdAt', 'severity', '-severity').default('-createdAt').optional(),
});

export default {
    createSymptomLogSchema,
    updateSymptomLogSchema,
    symptomLogIdParam,
    querySymptomsSchema,
};
