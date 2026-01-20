import { Router, Request, Response } from 'express';
import { validateBody } from '../middleware/validation';
import { createRateLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';
import { createContactSchema } from '../validators/contactValidator';
import fs from 'fs';
import path from 'path';

const router = Router();

// Path to contacts JSON file
const CONTACTS_FILE = path.join(__dirname, '../../data/contacts.json');

// Ensure data directory exists
const dataDir = path.dirname(CONTACTS_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize contacts file if it doesn't exist
if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
}

/**
 * Generate unique reference ID
 */
const generateReferenceId = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SS-${timestamp}-${random}`;
};

/**
 * Read contacts from JSON file
 */
const readContacts = (): any[] => {
    try {
        const data = fs.readFileSync(CONTACTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

/**
 * Write contacts to JSON file
 */
const writeContacts = (contacts: any[]): void => {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
};

/**
 * Contact form rate limiter
 * 5 submissions per hour per IP to prevent spam
 */
const contactFormLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many contact form submissions. Please try again later.',
});

/**
 * @route   POST /api/contact
 * @desc    Submit a contact form message (saves to JSON file)
 * @access  Public
 */
router.post(
    '/',
    contactFormLimiter,
    validateBody(createContactSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { name, email, phone, subject, message, website } = req.body;

        // Honeypot check - if website field is filled, it's likely a bot
        if (website && website.length > 0) {
            // Silently accept but don't save (don't let bots know they failed)
            return res.status(201).json({
                success: true,
                data: {
                    referenceId: 'SS-RECEIVED',
                },
                message: 'Thank you for your message. We will get back to you soon!',
            });
        }

        // Generate unique reference ID
        const referenceId = generateReferenceId();

        // Get client info for tracking
        const ipAddress =
            req.headers['x-forwarded-for']?.toString().split(',')[0] ||
            req.socket.remoteAddress ||
            'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';

        // Create contact object
        const contactData = {
            referenceId,
            name,
            email,
            phone: phone || null,
            subject,
            message,
            status: 'pending',
            ipAddress,
            userAgent,
            createdAt: new Date().toISOString(),
        };

        // Read existing contacts and add new one
        const contacts = readContacts();
        contacts.push(contactData);
        writeContacts(contacts);

        res.status(201).json({
            success: true,
            data: {
                referenceId: contactData.referenceId,
                createdAt: contactData.createdAt,
            },
            message: 'Thank you for your message. We will get back to you soon!',
        });
    })
);

/**
 * @route   GET /api/contact/:referenceId
 * @desc    Get contact status by reference ID
 * @access  Public
 */
router.get(
    '/:referenceId',
    asyncHandler(async (req: Request, res: Response) => {
        const { referenceId } = req.params;

        // Validate reference ID format
        if (!/^SS-[A-Z0-9]+-[A-Z0-9]+$/.test(referenceId)) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid reference ID format',
                },
            });
        }

        // Find contact in JSON file
        const contacts = readContacts();
        const contact = contacts.find((c: any) => c.referenceId === referenceId);

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Contact submission not found',
                },
            });
        }

        res.json({
            success: true,
            data: {
                referenceId: contact.referenceId,
                status: contact.status,
                subject: contact.subject,
                submittedAt: contact.createdAt,
            },
        });
    })
);

/**
 * @route   GET /api/contact
 * @desc    Get all contacts (admin endpoint)
 * @access  Public (for demo purposes)
 */
router.get(
    '/',
    asyncHandler(async (_req: Request, res: Response) => {
        const contacts = readContacts();
        res.json({
            success: true,
            data: contacts,
            count: contacts.length,
        });
    })
);

export default router;
