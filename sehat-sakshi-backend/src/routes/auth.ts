import { Router, Response } from 'express';
import { User } from '../models/User';
import { generateToken, protect, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { authLimiter, registrationLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema
} from '../validators/authValidator';
import {
  ConflictError,
  AuthenticationError,
  fromMongoError
} from '../utils/errors';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register',
  registrationLimiter,
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create user
    const user = await User.create({ name, email, phone, password });
    const token = generateToken(user._id as string);

    // Log successful registration
    logAuthEvent('REGISTER', user._id.toString(), true, req, { email, name });
    logger.info(`New user registered: ${email}`, {
      requestId: req.id,
      userId: user._id,
      email,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        token,
      },
      message: 'Registration successful',
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AuthenticationError('Invalid email or password');
    }

    const token = generateToken(user._id as string);

    // Log successful login
    logAuthEvent('LOGIN', user._id.toString(), true, req, { email });
    logger.info(`User logged in: ${email}`, {
      requestId: req.id,
      userId: user._id,
      email,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profilePic: user.profilePic
        },
        token,
      },
      message: 'Login successful',
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me',
  protect,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    res.json({
      success: true,
      data: {
        user: {
          id: (req.user! as any)._id,
          name: req.user!.name,
          email: req.user!.email,
          phone: req.user!.phone,
          profilePic: req.user!.profilePic,
        },
      },
    });
  })
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  protect,
  validateBody(updateProfileSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, phone, profilePic } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        (req.user! as any)._id,
        { name, phone, profilePic },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user!._id,
            name: user!.name,
            email: user!.email,
            phone: user!.phone,
            profilePic: user!.profilePic
          },
        },
        message: 'Profile updated successfully',
      });
    } catch (error: any) {
      throw fromMongoError(error);
    }
  })
);

export default router;
