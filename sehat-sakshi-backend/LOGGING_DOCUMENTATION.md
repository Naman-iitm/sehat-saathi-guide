# API Logging and Monitoring System

## Overview

This document describes the comprehensive logging and monitoring system implemented for the Sehat Saathi backend API.

## Features Implemented

### 1. Structured Logging with Winston

- **Multiple Log Levels**: error, warn, info, http, debug
- **Multiple Transports**:
  - Console (development)
  - Daily rotating files (production)
  - Separate error log files
  - Audit log files for security events
- **Log Rotation**: Automatic daily rotation with compression
- **Retention Policies**:
  - Application logs: 14 days
  - Error logs: 30 days
  - Audit logs: 90 days

### 2. Request/Response Logging

Every API request is logged with:
- Unique request ID (UUID)
- HTTP method and URL
- Client IP address
- User ID (if authenticated)
- User agent
- Request body (sanitized)
- Response status code
- Response time in milliseconds
- Timestamp

### 3. Performance Monitoring

- **Response Time Tracking**: All requests timed
- **Slow Request Detection**: Requests >100ms flagged
- **Endpoint Metrics**: Per-endpoint statistics
  - Request count
  - Average response time
  - Maximum response time
  - Error count
- **System Metrics**: CPU, memory, uptime

### 4. Audit Logging

Security-sensitive events are logged to a separate audit log:
- Authentication events (login, logout, registration)
- Failed login attempts
- Profile updates
- Data modifications (create, update, delete)
- Suspicious activity

### 5. Error Tracking

- Full stack traces for all errors
- Error context (request ID, user, URL)
- Separate error log file
- Global error handler

## File Structure

```
sehat-sakshi-backend/
├── src/
│   ├── config/
│   │   └── logger.ts              # Winston configuration
│   ├── middleware/
│   │   ├── requestLogger.ts       # Request/response logging
│   │   └── performanceMonitor.ts  # Performance tracking
│   ├── routes/
│   │   ├── metrics.ts             # Metrics API endpoints
│   │   ├── auth.ts                # Enhanced with audit logging
│   │   └── symptoms.ts            # Enhanced with operation logging
│   ├── types/
│   │   └── logger.types.ts        # TypeScript type definitions
│   ├── utils/
│   │   ├── requestId.ts           # Request ID generation
│   │   └── auditLogger.ts         # Audit logging utilities
│   ├── app.ts                     # Updated with logging middleware
│   └── server.ts                  # Enhanced startup logging
└── logs/                          # Log files directory
    ├── app-YYYY-MM-DD.log         # Application logs
    ├── error-YYYY-MM-DD.log       # Error logs
    └── audit-YYYY-MM-DD.log       # Audit logs
```

## API Endpoints

### Metrics Endpoints (Protected)

#### GET /api/metrics
Returns overall API performance metrics:
```json
{
  "success": true,
  "data": {
    "uptime": 3600,
    "memoryUsage": {...},
    "cpuUsage": {...},
    "requestCount": 1234,
    "averageResponseTime": 45,
    "slowRequestCount": 12,
    "errorCount": 5,
    "timestamp": "2026-01-12T14:00:00.000Z"
  }
}
```

#### GET /api/metrics/endpoints
Returns per-endpoint metrics:
```json
{
  "success": true,
  "data": {
    "POST /api/auth/login": {
      "count": 150,
      "totalTime": 6750,
      "maxTime": 120,
      "errorCount": 5,
      "averageTime": 45
    },
    ...
  }
}
```

#### GET /api/metrics/system
Returns system-level metrics:
```json
{
  "success": true,
  "data": {
    "hostname": "server-01",
    "platform": "linux",
    "nodeVersion": "v18.0.0",
    "uptime": {...},
    "memory": {...},
    "cpu": {...}
  }
}
```

#### GET /api/metrics/health
Public health check with detailed metrics:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 3600,
    "memory": {...},
    "requests": {...}
  }
}
```

## Environment Variables

```env
# Logging Configuration
NODE_ENV=development|production
SLOW_REQUEST_THRESHOLD=100  # milliseconds
ENABLE_FILE_LOGS=true|false # Force file logging in development
```

## Usage Examples

### Logging in Application Code

```typescript
import logger from './config/logger';

// Info logging
logger.info('User action completed', {
  userId: '123',
  action: 'profile_update'
});

// Error logging
logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack
});

// Debug logging (development only)
logger.debug('Processing request', {
  requestId: req.id,
  data: sanitizedData
});
```

### Audit Logging

```typescript
import { logAuthEvent, logDataEvent } from './utils/auditLogger';

// Log authentication
logAuthEvent('LOGIN', userId, true, req);

// Log data modification
logDataEvent('CREATE', userId, 'symptoms', symptomId, req, {
  severity: 'high'
});
```

## Log Format

### Console Output (Development)
```
2026-01-12 14:30:45:123 info: Server running on http://localhost:5000
2026-01-12 14:30:50:456 http: Incoming POST /api/auth/login
2026-01-12 14:30:50:567 http: POST /api/auth/login 200 - 111ms
```

### File Output (Production)
```json
{
  "level": "info",
  "message": "User logged in: user@example.com",
  "requestId": "a1b2c3d4",
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "timestamp": "2026-01-12T14:30:50.567Z"
}
```

## Security Features

### Data Sanitization
Sensitive fields are automatically redacted from logs:
- `password`
- `token`
- `authorization`
- `cookie`
- `secret`
- `apiKey`
- `accessToken`
- `refreshToken`

Example:
```json
{
  "body": {
    "email": "user@example.com",
    "password": "[REDACTED]"
  }
}
```

### Audit Trail
All security-sensitive operations are logged:
- Failed login attempts (with IP address)
- Successful authentications
- Profile modifications
- Data access and modifications

## Performance Impact

- **Minimal overhead**: < 5ms per request
- **Async logging**: Non-blocking operations
- **Efficient storage**: Compressed log rotation
- **Memory efficient**: Streaming writes

## Monitoring and Alerts

### Slow Request Detection
Requests exceeding the threshold (default 100ms) are automatically logged as warnings:
```json
{
  "type": "slow_request",
  "requestId": "a1b2c3d4",
  "method": "POST",
  "url": "/api/symptoms",
  "duration": "150ms",
  "threshold": "100ms"
}
```

### Error Rate Monitoring
The `/api/metrics/health` endpoint provides error rate:
```json
{
  "requests": {
    "total": 1000,
    "errors": 50,
    "errorRate": "5.00"
  }
}
```

## Best Practices

1. **Use appropriate log levels**:
   - `error`: Errors that need immediate attention
   - `warn`: Warning conditions
   - `info`: General informational messages
   - `http`: HTTP request/response logs
   - `debug`: Detailed debugging information

2. **Include context**:
   - Always include `requestId` for request tracing
   - Include `userId` for user-specific operations
   - Add relevant metadata for debugging

3. **Avoid logging sensitive data**:
   - Never log passwords, tokens, or API keys
   - Use the sanitization utilities provided

4. **Monitor metrics regularly**:
   - Check `/api/metrics` for performance trends
   - Monitor slow request counts
   - Track error rates

## Troubleshooting

### Logs not appearing in files
- Check `NODE_ENV` is set to `production`
- Or set `ENABLE_FILE_LOGS=true`
- Verify `logs/` directory exists and is writable

### High memory usage
- Check log retention policies
- Ensure old logs are being rotated and compressed
- Consider reducing retention periods

### Missing request IDs
- Ensure `requestLogger` middleware is registered before routes
- Check middleware order in `app.ts`

## Future Enhancements

- [ ] Integration with external monitoring services (e.g., Datadog, New Relic)
- [ ] Real-time log streaming
- [ ] Automated alerting for critical errors
- [ ] Log aggregation and search (e.g., ELK stack)
- [ ] Custom metrics dashboards
- [ ] Rate limiting based on metrics

## Dependencies

- `winston`: ^3.11.0 - Logging framework
- `winston-daily-rotate-file`: ^4.7.1 - Log rotation
- `uuid`: ^9.0.1 - Request ID generation
- `@types/uuid`: ^9.0.7 - TypeScript types

## License

This logging system is part of the Sehat Saathi project.
