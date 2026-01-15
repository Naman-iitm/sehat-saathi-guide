import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels with custom priorities
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each log level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

// Add colors to Winston
winston.addColors(colors);

// Determine log level based on environment
const getLogLevel = (): string => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'http';
};

// Custom format for console output
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
    )
);

// Custom format for file output (JSON)
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create logs directory path
const logsDir = path.join(__dirname, '../../logs');

// Define transports
const transports: winston.transport[] = [
    // Console transport for development
    new winston.transports.Console({
        format: consoleFormat,
    }),
];

// Add file transports only in production or if explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_FILE_LOGS === 'true') {
    // General application logs - rotated daily
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: fileFormat,
        })
    );

    // Error logs - rotated daily, kept longer
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'error',
            format: fileFormat,
        })
    );

    // Audit logs - for security and compliance
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'audit-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '90d',
            format: fileFormat,
        })
    );
}

// Create the logger instance
const logger = winston.createLogger({
    level: getLogLevel(),
    levels,
    transports,
    // Handle uncaught exceptions
    exceptionHandlers: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
    ],
    // Handle unhandled promise rejections
    rejectionHandlers: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
    ],
    exitOnError: false,
});

// Create a separate audit logger for security events
export const auditLogger = winston.createLogger({
    level: 'info',
    format: fileFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
                winston.format.colorize({ all: true }),
                winston.format.printf(
                    (info) => `${info.timestamp} [AUDIT] ${info.level}: ${info.message}`
                )
            ),
        }),
    ],
});

// Add file transport for audit logs in production
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_FILE_LOGS === 'true') {
    auditLogger.add(
        new DailyRotateFile({
            filename: path.join(logsDir, 'audit-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '90d',
        })
    );
}

// Stream for Morgan HTTP logger integration
export const stream = {
    write: (message: string) => {
        logger.http(message.trim());
    },
};

export default logger;
