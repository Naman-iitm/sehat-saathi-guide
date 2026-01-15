import { Router, Response } from 'express';
import { Order } from '../models/Order';
import { protect, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { writeLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createOrderSchema,
  orderIdParam,
  cancelOrderSchema
} from '../validators/ordersValidator';
import { NotFoundError, ValidationError, fromMongoError } from '../utils/errors';

const router = Router();

/**
 * @route   GET /api/orders
 * @desc    Get all orders for current user
 * @access  Private
 */
router.get('/',
  protect,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({
      userId: (req.user as any)._id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  })
);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/',
  protect,
  writeLimiter,
  validateBody(createOrderSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { items, shippingAddress, paymentMethod, notes, couponCode } = req.body;

    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      const itemPrice = item.price * item.quantity;
      const discount = item.discount ? (itemPrice * item.discount / 100) : 0;
      return sum + (itemPrice - discount);
    }, 0);

    try {
      const order = await Order.create({
        userId: (req.user as any)._id,
        items,
        total,
        shippingAddress,
        paymentMethod,
        notes,
        couponCode,
        status: 'confirmed',
      });

      res.status(201).json({
        success: true,
        data: order,
        message: 'Order placed successfully',
      });
    } catch (error: any) {
      throw fromMongoError(error);
    }
  })
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get a specific order
 * @access  Private
 */
router.get('/:id',
  protect,
  validateParams(orderIdParam),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: (req.user as any)._id
    });

    if (!order) {
      throw new NotFoundError('Order not found', 'Order');
    }

    res.json({
      success: true,
      data: order,
    });
  })
);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel an order
 * @access  Private
 */
router.put('/:id/cancel',
  protect,
  validateParams(orderIdParam),
  validateBody(cancelOrderSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reason } = req.body;

    // First check if order exists and belongs to user
    const existingOrder = await Order.findOne({
      _id: req.params.id,
      userId: (req.user as any)._id
    });

    if (!existingOrder) {
      throw new NotFoundError('Order not found', 'Order');
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(existingOrder.status)) {
      throw new ValidationError(
        `Cannot cancel order with status: ${existingOrder.status}. Only pending or confirmed orders can be cancelled.`
      );
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully',
    });
  })
);

export default router;
