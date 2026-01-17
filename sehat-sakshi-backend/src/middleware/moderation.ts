import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

// A basic list of profane or inappropriate words (expand as needed)
// Using a set for O(1) lookups if we were checking individual words,
// but for substring checks in sentences, array is fine.
const BANNED_KEYWORDS = [
    'abuse',
    'kill',
    'suicide',
    'hate',
    'scam',
    'fraud',
    'spam',
    // Add more specific bad words as needed
    // Note: This is a basic filter.
];

/**
 * Moderate content middleware
 * Checks 'title' and 'content' fields in the request body
 */
export const moderateContent = (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;

    const contentToCheck = [title, content].filter(Boolean).join(' ').toLowerCase();

    for (const word of BANNED_KEYWORDS) {
        if (contentToCheck.includes(word)) {
            // Option 1: Reject the request
            return next(new AppError('Content contains inappropriate language.', 400, 'MODERATION_ERROR'));

            // Option 2 (Alternative): Flag it but allow it (Post model updates needed)
            // req.body.isFlagged = true;
            // break; 
        }
    }

    next();
};
