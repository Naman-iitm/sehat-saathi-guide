import { Router, Response } from 'express';
import { User } from '../models/User';
import { generateToken, protect, AuthRequest } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({ name, email, phone, password });
    const token = generateToken(user._id as string);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user._id as string);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, profilePic: user.profilePic },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', protect, async (req: AuthRequest, res: Response) => {
  res.json({
    user: {
      id: (req.user! as any)._id,
      name: req.user!.name,
      email: req.user!.email,
      phone: req.user!.phone,
      profilePic: req.user!.profilePic,
    },
  });
});

// Update profile
router.put('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, profilePic } = req.body;
    
    const user = await User.findByIdAndUpdate(
      (req.user! as any)._id,
      { name, phone, profilePic },
      { new: true }
    );

    res.json({
      user: { id: user!._id, name: user!.name, email: user!.email, phone: user!.phone, profilePic: user!.profilePic },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
