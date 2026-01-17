import Joi from 'joi';
import { patterns } from '../middleware/validation';

/**
 * Auth Validation Schemas
 * Validation schemas for authentication-related endpoints
 */

/**
 * Register validation schema
 */
export const registerSchema = Joi.object({
    name: patterns.name.required().messages({
        'any.required': 'Name is required',
    }),
    email: patterns.email.required().messages({
        'any.required': 'Email is required',
    }),
    phone: patterns.phone.required().messages({
        'any.required': 'Phone number is required',
    }),
    password: patterns.password.required().messages({
        'any.required': 'Password is required',
    }),
});

/**
 * Login validation schema
 */
export const loginSchema = Joi.object({
    email: patterns.email.required().messages({
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    }),
});

/**
 * Profile update validation schema
 */
export const updateProfileSchema = Joi.object({
    name: patterns.name.optional(),
    phone: patterns.phone.optional(),
    profilePic: patterns.url.optional().allow('', null),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required',
    }),
    newPassword: patterns.password.required().messages({
        'any.required': 'New password is required',
    }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.required': 'Password confirmation is required',
            'any.only': 'Passwords do not match',
        }),
});

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = Joi.object({
    email: patterns.email.required().messages({
        'any.required': 'Email is required',
    }),
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        'any.required': 'Reset token is required',
    }),
    password: patterns.password.required().messages({
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.required': 'Password confirmation is required',
            'any.only': 'Passwords do not match',
        }),
});

export default {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
