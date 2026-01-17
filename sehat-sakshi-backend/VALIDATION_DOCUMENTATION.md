# Input Validation and Error Handling Documentation

## Overview

This document describes the comprehensive input validation and centralized error handling system implemented for the Sehat Saathi backend API.

## Features Implemented

### 1. Custom Error Classes

Located in `src/utils/errors.ts`:

| Error Class | Status Code | Description |
|-------------|-------------|-------------|
| `ValidationError` | 400 | Input validation failures |
| `AuthenticationError` | 401 | Authentication failures |
| `AuthorizationError` | 403 | Permission denied |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Duplicate/conflict errors |
| `RateLimitError` | 429 | Too many requests |
| `DatabaseError` | 500 | Database operation failures |
| `InternalServerError` | 500 | Unexpected server errors |
| `ServiceUnavailableError` | 503 | Service temporarily unavailable |

### 2. Input Validation with Joi

#### Validation Schemas Created

**Auth Validators** (`src/validators/authValidator.ts`):
- `registerSchema` - User registration
- `loginSchema` - User login
- `updateProfileSchema` - Profile updates
- `changePasswordSchema` - Password changes
- `forgotPasswordSchema` - Password reset request
- `resetPasswordSchema` - Password reset confirmation

**Symptoms Validators** (`src/validators/symptomsValidator.ts`):
- `createSymptomLogSchema` - Create symptom log
- `updateSymptomLogSchema` - Update symptom log
- `symptomLogIdParam` - Validate symptom ID
- `querySymptomsSchema` - Query parameters

**Orders Validators** (`src/validators/ordersValidator.ts`):
- `createOrderSchema` - Create order
- `updateOrderStatusSchema` - Update order status
- `orderIdParam` - Validate order ID
- `queryOrdersSchema` - Query parameters
- `cancelOrderSchema` - Cancel order

**Reminders Validators** (`src/validators/remindersValidator.ts`):
- `createReminderSchema` - Create reminder
- `updateReminderSchema` - Update reminder
- `reminderIdParam` - Validate reminder ID
- `queryRemindersSchema` - Query parameters

**Medical History Validators** (`src/validators/medicalHistoryValidator.ts`):
- `medicalHistorySchema` - Full medical history
- `addAllergySchema` - Add allergy
- `addMedicationSchema` - Add medication
- `addConditionSchema` - Add condition

### 3. Validation Middleware

Located in `src/middleware/validation.ts`:

```typescript
// Validate request body
validateBody(schema)

// Validate query parameters
validateQuery(schema)

// Validate route parameters
validateParams(schema)

// Combined validation
validateRequest({ body, query, params })
```

### 4. Rate Limiting

Located in `src/middleware/rateLimiter.ts`:

| Limiter | Limit | Window | Use Case |
|---------|-------|--------|----------|
| `generalLimiter` | 100 | 15 min | General API |
| `authLimiter` | 5 | 15 min | Login attempts |
| `registrationLimiter` | 3 | 1 hour | Registrations |
| `passwordResetLimiter` | 3 | 15 min | Password reset |
| `writeLimiter` | 30 | 1 min | Write operations |
| `heavyOperationLimiter` | 5 | 10 min | Exports, reports |

### 5. Global Error Handler

Located in `src/middleware/errorHandler.ts`:

- Catches all errors thrown in routes
- Converts MongoDB errors to application errors
- Sanitizes error messages for production
- Returns consistent error response format
- Includes stack trace in development mode

### 6. Security Middleware

- **Helmet**: Security headers (CSP, XSS protection, etc.)
- **CORS**: Cross-origin request handling
- **Rate Limiting**: Prevent abuse
- **Input Sanitization**: Automatic with Joi

## File Structure

```
sehat-sakshi-backend/
├── src/
│   ├── middleware/
│   │   ├── errorHandler.ts     # Global error handling
│   │   ├── validation.ts       # Joi validation middleware
│   │   └── rateLimiter.ts      # Rate limiting
│   ├── utils/
│   │   └── errors.ts           # Custom error classes
│   ├── validators/
│   │   ├── authValidator.ts    # Auth validation schemas
│   │   ├── symptomsValidator.ts # Symptoms validation
│   │   ├── ordersValidator.ts  # Orders validation
│   │   ├── remindersValidator.ts # Reminders validation
│   │   └── medicalHistoryValidator.ts # Medical history
│   ├── routes/
│   │   ├── auth.ts             # Enhanced with validation
│   │   ├── symptoms.ts         # Enhanced with validation
│   │   └── orders.ts           # Enhanced with validation
│   └── app.ts                  # Updated with middleware
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address",
        "type": "string.email"
      }
    ]
  },
  "requestId": "abc123",
  "timestamp": "2026-01-13T14:30:00.000Z"
}
```

## Usage Examples

### Using Validation in Routes

```typescript
import { validateBody, validateParams } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { createUserSchema, userIdParam } from '../validators/userValidator';

router.post('/', 
  validateBody(createUserSchema),
  asyncHandler(async (req, res) => {
    // req.body is now validated and sanitized
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  })
);

router.get('/:id',
  validateParams(userIdParam),
  asyncHandler(async (req, res) => {
    // req.params.id is validated as MongoDB ObjectId
    const user = await User.findById(req.params.id);
    res.json({ success: true, data: user });
  })
);
```

### Creating Custom Validators

```typescript
import Joi from 'joi';
import { patterns } from '../middleware/validation';

export const myCustomSchema = Joi.object({
  name: patterns.name.required(),
  email: patterns.email.required(),
  age: Joi.number().min(0).max(150).optional(),
  status: Joi.string().valid('active', 'inactive').default('active'),
});
```

### Throwing Custom Errors

```typescript
import { 
  ValidationError, 
  NotFoundError, 
  AuthenticationError 
} from '../utils/errors';

// Validation error with details
throw new ValidationError('Invalid input', [
  { field: 'email', message: 'Email is required' }
]);

// Not found error
throw new NotFoundError('User not found', 'User');

// Authentication error
throw new AuthenticationError('Invalid credentials');
```

## Validation Patterns

Common patterns available in `validation.ts`:

```typescript
patterns.objectId    // MongoDB ObjectId
patterns.email       // Email address
patterns.password    // Password (8-128 chars)
patterns.phone       // 10-digit phone
patterns.name        // Name (2-50 chars)
patterns.url         // Valid URL
```

## Error Handling Flow

1. Request comes in
2. Rate limiter checks if limit exceeded
3. Validation middleware validates input
4. Route handler processes request
5. If error thrown, global error handler catches it
6. Error is converted to appropriate AppError
7. Consistent error response is sent

## Security Features

### Helmet Configuration
- Content Security Policy
- XSS Protection
- Frame Options
- HSTS (in production)

### Rate Limiting
- Per-IP and per-user limits
- Different limits for different operations
- Automatic blocking of abusive clients

### Input Sanitization
- Automatic trimming of strings
- Unknown fields stripped
- Type coercion disabled

## Dependencies

```json
{
  "joi": "^17.11.0",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0"
}
```

## Best Practices

1. **Always use validation** - Every route should validate input
2. **Use asyncHandler** - Wrap all async routes
3. **Throw specific errors** - Use appropriate error class
4. **Don't expose internals** - Sanitize errors in production
5. **Rate limit sensitive routes** - Auth, writes, exports

## Testing

```bash
# Test validation error
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid"}'

# Expected response:
{
  "success": false,
  "error": {
    "message": "Name is required; Please provide a valid email address; ...",
    "code": "VALIDATION_ERROR",
    "details": [...]
  }
}
```

## Troubleshooting

### Validation not working
- Ensure middleware is in correct order
- Check schema exports
- Verify field names match request

### Rate limiting issues
- Check window and max settings
- Verify keyGenerator function
- Check if skipSuccessfulRequests is set

### Errors not being caught
- Wrap handlers with asyncHandler
- Ensure error handler is last middleware
- Check error is being thrown, not returned

## License

This validation system is part of the Sehat Saathi project.
