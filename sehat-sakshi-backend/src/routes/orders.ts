import { Router, Response } from 'express';
import { Order } from '../models/Order';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user orders
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: (req.user as any)._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { items, total, shippingAddress } = req.body;

    const order = await Order.create({
      userId: (req.user as any)._id,
      items,
      total,
      shippingAddress,
      status: 'confirmed',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: (req.user as any)._id });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.put('/:id/cancel', protect, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: (req.user as any)._id, status: { $in: ['pending', 'confirmed'] } },
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!order) {
      res.status(400).json({ message: 'Cannot cancel this order' });
      return;
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
