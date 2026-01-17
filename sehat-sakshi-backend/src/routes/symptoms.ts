import { Router, Response } from 'express';
import { SymptomLog } from '../models/SymptomLog';
import { protect, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { writeLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createSymptomLogSchema,
  symptomLogIdParam
} from '../validators/symptomsValidator';
import { NotFoundError, fromMongoError } from '../utils/errors';

const router = Router();

/**
 * @route   GET /api/symptoms
 * @desc    Get all symptom logs for current user
 * @access  Private
 */
router.get('/',
  protect,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const logs = await SymptomLog.find({
      userId: (req.user as any)._id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: logs,
      count: logs.length,
    });
  })
);

/**
 * @route   POST /api/symptoms
 * @desc    Create a new symptom log
 * @access  Private
 */
router.post('/',
  protect,
  writeLimiter,
  validateBody(createSymptomLogSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { symptoms, severity, notes, triageResult } = req.body;
    const userId = (req.user as any)._id;

    try {
      const log = await SymptomLog.create({
        userId: (req.user as any)._id,
        symptoms,
        severity,
        notes,
        triageResult,
      });

      res.status(201).json({
        success: true,
        data: log,
        message: 'Symptom log created successfully',
      });
    } catch (error: any) {
      throw fromMongoError(error);
    }
  })
);

/**
 * @route   GET /api/symptoms/:id
 * @desc    Get a specific symptom log
 * @access  Private
 */
router.get('/:id',
  protect,
  validateParams(symptomLogIdParam),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const log = await SymptomLog.findOne({
      _id: req.params.id,
      userId: (req.user as any)._id
    });

    if (!log) {
      throw new NotFoundError('Symptom log not found', 'SymptomLog');
    }

    res.json({
      success: true,
      data: log,
    });
  })
);

/**
 * @route   DELETE /api/symptoms/:id
 * @desc    Delete a symptom log
 * @access  Private
 */
router.delete('/:id',
  protect,
  validateParams(symptomLogIdParam),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const log = await SymptomLog.findOneAndDelete({
      _id: req.params.id,
      userId: (req.user as any)._id
    });

    if (!log) {
      throw new NotFoundError('Symptom log not found', 'SymptomLog');
    }

    res.json({
      success: true,
      message: 'Symptom log deleted successfully',
    });
  })
);

export default router;
