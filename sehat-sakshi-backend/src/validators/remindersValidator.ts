import Joi from 'joi';
import { patterns } from '../middleware/validation';

/**
 * Reminders Validation Schemas
 * Validation schemas for reminder-related endpoints
 */

/**
 * Reminder type enum
 */
const reminderTypeEnum = ['medication', 'appointment', 'checkup', 'exercise', 'custom'];

/**
 * Frequency enum
 */
const frequencyEnum = ['once', 'daily', 'weekly', 'monthly', 'custom'];

/**
 * Days of week enum
 */
const daysOfWeekEnum = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/**
 * Create reminder validation schema
 */
export const createReminderSchema = Joi.object({
    title: Joi.string().min(2).max(200).trim().required().messages({
        'string.min': 'Title must be at least 2 characters',
        'string.max': 'Title must not exceed 200 characters',
        'any.required': 'Reminder title is required',
    }),
    type: Joi.string()
        .valid(...reminderTypeEnum)
        .required()
        .messages({
            'any.only': `Type must be one of: ${reminderTypeEnum.join(', ')}`,
            'any.required': 'Reminder type is required',
        }),
    description: Joi.string().max(500).trim().optional().allow(''),
    time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
        'string.pattern.base': 'Time must be in HH:MM format',
        'any.required': 'Reminder time is required',
    }),
    frequency: Joi.string()
        .valid(...frequencyEnum)
        .required()
        .messages({
            'any.only': `Frequency must be one of: ${frequencyEnum.join(', ')}`,
            'any.required': 'Reminder frequency is required',
        }),
    daysOfWeek: Joi.array()
        .items(Joi.string().valid(...daysOfWeekEnum))
        .when('frequency', {
            is: 'weekly',
            then: Joi.array().min(1).required().messages({
                'array.min': 'At least one day must be selected for weekly reminders',
                'any.required': 'Days of week are required for weekly reminders',
            }),
            otherwise: Joi.array().optional(),
        }),
    startDate: Joi.date().iso().min('now').required().messages({
        'date.min': 'Start date cannot be in the past',
        'any.required': 'Start date is required',
    }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
        'date.min': 'End date must be after start date',
    }),
    isActive: Joi.boolean().default(true),
    medicationDetails: Joi.object({
        name: Joi.string().max(200).required(),
        dosage: Joi.string().max(100).required(),
        instructions: Joi.string().max(500).optional().allow(''),
    }).when('type', {
        is: 'medication',
        then: Joi.object().optional(),
        otherwise: Joi.forbidden(),
    }),
    appointmentDetails: Joi.object({
        doctorName: Joi.string().max(200).optional(),
        location: Joi.string().max(200).optional(),
        notes: Joi.string().max(500).optional().allow(''),
    }).when('type', {
        is: 'appointment',
        then: Joi.object().optional(),
        otherwise: Joi.forbidden(),
    }),
});

/**
 * Update reminder validation schema
 */
export const updateReminderSchema = Joi.object({
    title: Joi.string().min(2).max(200).trim().optional(),
    type: Joi.string().valid(...reminderTypeEnum).optional(),
    description: Joi.string().max(500).trim().optional().allow(''),
    time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().messages({
        'string.pattern.base': 'Time must be in HH:MM format',
    }),
    frequency: Joi.string().valid(...frequencyEnum).optional(),
    daysOfWeek: Joi.array().items(Joi.string().valid(...daysOfWeekEnum)).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    isActive: Joi.boolean().optional(),
    medicationDetails: Joi.object({
        name: Joi.string().max(200).optional(),
        dosage: Joi.string().max(100).optional(),
        instructions: Joi.string().max(500).optional().allow(''),
    }).optional(),
    appointmentDetails: Joi.object({
        doctorName: Joi.string().max(200).optional(),
        location: Joi.string().max(200).optional(),
        notes: Joi.string().max(500).optional().allow(''),
    }).optional(),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

/**
 * Reminder ID param validation
 */
export const reminderIdParam = Joi.object({
    id: patterns.objectId.required().messages({
        'any.required': 'Reminder ID is required',
    }),
});

/**
 * Query reminders validation schema
 */
export const queryRemindersSchema = Joi.object({
    type: Joi.string().valid(...reminderTypeEnum).optional(),
    isActive: Joi.boolean().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
        'date.min': 'End date must be after start date',
    }),
    limit: Joi.number().integer().min(1).max(100).default(20).optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
});

export default {
    createReminderSchema,
    updateReminderSchema,
    reminderIdParam,
    queryRemindersSchema,
};
