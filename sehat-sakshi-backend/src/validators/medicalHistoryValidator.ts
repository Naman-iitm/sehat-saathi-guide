import Joi from 'joi';
import { patterns } from '../middleware/validation';

/**
 * Medical History Validation Schemas
 * Validation schemas for medical history-related endpoints
 */

/**
 * Blood group enum
 */
const bloodGroupEnum = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Allergy item schema
 */
const allergySchema = Joi.object({
    name: Joi.string().min(2).max(100).trim().required(),
    severity: Joi.string().valid('mild', 'moderate', 'severe').optional(),
    notes: Joi.string().max(300).optional().allow(''),
});

/**
 * Medication item schema
 */
const medicationSchema = Joi.object({
    name: Joi.string().min(2).max(200).trim().required(),
    dosage: Joi.string().max(100).optional(),
    frequency: Joi.string().max(100).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    notes: Joi.string().max(300).optional().allow(''),
    isActive: Joi.boolean().default(true),
});

/**
 * Condition item schema
 */
const conditionSchema = Joi.object({
    name: Joi.string().min(2).max(200).trim().required(),
    diagnosedDate: Joi.date().iso().optional(),
    status: Joi.string().valid('active', 'resolved', 'managed').default('active'),
    notes: Joi.string().max(500).optional().allow(''),
});

/**
 * Surgery item schema
 */
const surgerySchema = Joi.object({
    name: Joi.string().min(2).max(200).trim().required(),
    date: Joi.date().iso().required(),
    hospital: Joi.string().max(200).optional(),
    surgeon: Joi.string().max(100).optional(),
    notes: Joi.string().max(500).optional().allow(''),
});

/**
 * Family history item schema
 */
const familyHistorySchema = Joi.object({
    condition: Joi.string().min(2).max(200).trim().required(),
    relationship: Joi.string().valid(
        'father', 'mother', 'sibling', 'grandparent',
        'aunt', 'uncle', 'cousin', 'other'
    ).required(),
    notes: Joi.string().max(300).optional().allow(''),
});

/**
 * Create/Update medical history validation schema
 */
export const medicalHistorySchema = Joi.object({
    bloodGroup: Joi.string().valid(...bloodGroupEnum).optional().messages({
        'any.only': `Blood group must be one of: ${bloodGroupEnum.join(', ')}`,
    }),
    height: Joi.number().min(50).max(300).optional().messages({
        'number.min': 'Height must be at least 50 cm',
        'number.max': 'Height must not exceed 300 cm',
    }),
    weight: Joi.number().min(1).max(500).optional().messages({
        'number.min': 'Weight must be at least 1 kg',
        'number.max': 'Weight must not exceed 500 kg',
    }),
    dateOfBirth: Joi.date().iso().max('now').optional().messages({
        'date.max': 'Date of birth cannot be in the future',
    }),
    allergies: Joi.array().items(allergySchema).max(50).optional().messages({
        'array.max': 'Cannot have more than 50 allergies',
    }),
    currentMedications: Joi.array().items(medicationSchema).max(50).optional().messages({
        'array.max': 'Cannot have more than 50 medications',
    }),
    pastMedications: Joi.array().items(medicationSchema).max(100).optional().messages({
        'array.max': 'Cannot have more than 100 past medications',
    }),
    chronicConditions: Joi.array().items(conditionSchema).max(50).optional().messages({
        'array.max': 'Cannot have more than 50 chronic conditions',
    }),
    pastSurgeries: Joi.array().items(surgerySchema).max(50).optional().messages({
        'array.max': 'Cannot have more than 50 past surgeries',
    }),
    familyHistory: Joi.array().items(familyHistorySchema).max(50).optional().messages({
        'array.max': 'Cannot have more than 50 family history entries',
    }),
    vaccinations: Joi.array().items(Joi.object({
        name: Joi.string().max(200).required(),
        date: Joi.date().iso().optional(),
        notes: Joi.string().max(300).optional().allow(''),
    })).max(100).optional(),
    emergencyContact: Joi.object({
        name: Joi.string().max(100).required(),
        relationship: Joi.string().max(50).required(),
        phone: patterns.phone.required(),
        alternatePhone: patterns.phone.optional(),
    }).optional(),
    insuranceInfo: Joi.object({
        provider: Joi.string().max(200).optional(),
        policyNumber: Joi.string().max(100).optional(),
        validUntil: Joi.date().iso().optional(),
    }).optional(),
    notes: Joi.string().max(2000).optional().allow(''),
});

/**
 * Add allergy validation schema
 */
export const addAllergySchema = Joi.object({
    allergy: allergySchema.required(),
});

/**
 * Add medication validation schema
 */
export const addMedicationSchema = Joi.object({
    medication: medicationSchema.required(),
});

/**
 * Add condition validation schema
 */
export const addConditionSchema = Joi.object({
    condition: conditionSchema.required(),
});

export default {
    medicalHistorySchema,
    addAllergySchema,
    addMedicationSchema,
    addConditionSchema,
};
