import Joi from 'joi';
import { patterns } from '../middleware/validation';

/**
 * Orders Validation Schemas
 * Validation schemas for order-related endpoints
 */

/**
 * Order status enum
 */
const orderStatusEnum = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

/**
 * Payment method enum
 */
const paymentMethodEnum = ['cod', 'online', 'upi', 'card', 'wallet'];

/**
 * Cart item schema
 */
const cartItemSchema = Joi.object({
    productId: patterns.objectId.required().messages({
        'any.required': 'Product ID is required',
    }),
    name: Joi.string().min(2).max(200).trim().required().messages({
        'string.min': 'Product name must be at least 2 characters',
        'string.max': 'Product name must not exceed 200 characters',
        'any.required': 'Product name is required',
    }),
    quantity: Joi.number().integer().min(1).max(100).required().messages({
        'number.min': 'Quantity must be at least 1',
        'number.max': 'Quantity cannot exceed 100',
        'any.required': 'Quantity is required',
    }),
    price: Joi.number().positive().precision(2).required().messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required',
    }),
    discount: Joi.number().min(0).max(100).optional().default(0).messages({
        'number.min': 'Discount cannot be negative',
        'number.max': 'Discount cannot exceed 100%',
    }),
    image: patterns.url.optional().allow(''),
});

/**
 * Address schema
 */
const addressSchema = Joi.object({
    fullName: Joi.string().min(2).max(100).trim().required().messages({
        'any.required': 'Full name is required',
    }),
    phone: patterns.phone.required().messages({
        'any.required': 'Phone number is required',
    }),
    addressLine1: Joi.string().min(5).max(200).trim().required().messages({
        'string.min': 'Address must be at least 5 characters',
        'any.required': 'Address is required',
    }),
    addressLine2: Joi.string().max(200).trim().optional().allow(''),
    city: Joi.string().min(2).max(100).trim().required().messages({
        'any.required': 'City is required',
    }),
    state: Joi.string().min(2).max(100).trim().required().messages({
        'any.required': 'State is required',
    }),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
        'string.pattern.base': 'Please provide a valid 6-digit pincode',
        'any.required': 'Pincode is required',
    }),
    landmark: Joi.string().max(200).trim().optional().allow(''),
    type: Joi.string().valid('home', 'work', 'other').default('home'),
});

/**
 * Create order validation schema
 */
export const createOrderSchema = Joi.object({
    items: Joi.array()
        .items(cartItemSchema)
        .min(1)
        .max(50)
        .required()
        .messages({
            'array.min': 'At least one item is required',
            'array.max': 'Cannot order more than 50 items at once',
            'any.required': 'Order items are required',
        }),
    shippingAddress: addressSchema.required().messages({
        'any.required': 'Shipping address is required',
    }),
    paymentMethod: Joi.string()
        .valid(...paymentMethodEnum)
        .required()
        .messages({
            'any.only': `Payment method must be one of: ${paymentMethodEnum.join(', ')}`,
            'any.required': 'Payment method is required',
        }),
    notes: Joi.string().max(500).trim().optional().allow(''),
    couponCode: Joi.string().max(50).trim().optional().allow(''),
});

/**
 * Update order status validation schema
 */
export const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...orderStatusEnum)
        .required()
        .messages({
            'any.only': `Status must be one of: ${orderStatusEnum.join(', ')}`,
            'any.required': 'Order status is required',
        }),
    notes: Joi.string().max(500).trim().optional().allow(''),
    trackingNumber: Joi.string().max(100).trim().optional(),
    estimatedDelivery: Joi.date().iso().optional(),
});

/**
 * Order ID param validation
 */
export const orderIdParam = Joi.object({
    id: patterns.objectId.required().messages({
        'any.required': 'Order ID is required',
    }),
});

/**
 * Query orders validation schema
 */
export const queryOrdersSchema = Joi.object({
    status: Joi.string().valid(...orderStatusEnum).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
        'date.min': 'End date must be after start date',
    }),
    limit: Joi.number().integer().min(1).max(100).default(20).optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
    sort: Joi.string().valid('createdAt', '-createdAt', 'total', '-total').default('-createdAt').optional(),
});

/**
 * Cancel order validation schema
 */
export const cancelOrderSchema = Joi.object({
    reason: Joi.string().min(10).max(500).trim().required().messages({
        'string.min': 'Cancellation reason must be at least 10 characters',
        'string.max': 'Cancellation reason must not exceed 500 characters',
        'any.required': 'Cancellation reason is required',
    }),
});

export default {
    createOrderSchema,
    updateOrderStatusSchema,
    orderIdParam,
    queryOrdersSchema,
    cancelOrderSchema,
};
