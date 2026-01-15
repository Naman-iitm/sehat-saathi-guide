/**
 * Logger Types for Sehat Saathi Backend
 * TypeScript type definitions for the logging system
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

export interface RequestLogData {
    requestId: string;
    method: string;
    url: string;
    ip?: string;
    userId?: string;
    userAgent?: string;
    timestamp: string;
    body?: Record<string, unknown>;
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
}

export interface ResponseLogData {
    requestId: string;
    method: string;
    url: string;
    statusCode: number;
    duration: number;
    contentLength?: number;
    timestamp: string;
}

export interface ErrorLogData {
    requestId?: string;
    message: string;
    stack?: string;
    code?: string;
    statusCode?: number;
    url?: string;
    method?: string;
    userId?: string;
    timestamp: string;
    context?: Record<string, unknown>;
}

export interface AuditLogData {
    requestId?: string;
    userId: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    ip?: string;
    timestamp: string;
    success: boolean;
}

export type AuditAction =
    | 'LOGIN'
    | 'LOGOUT'
    | 'LOGIN_FAILED'
    | 'REGISTER'
    | 'PASSWORD_CHANGE'
    | 'PROFILE_UPDATE'
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'READ';

export interface PerformanceMetrics {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
    requestCount: number;
    averageResponseTime: number;
    slowRequestCount: number;
    errorCount: number;
    timestamp: string;
}

export interface SlowRequestLog {
    requestId: string;
    method: string;
    url: string;
    duration: number;
    threshold: number;
    timestamp: string;
}

// Extend Express Request to include requestId
declare global {
    namespace Express {
        interface Request {
            id?: string;
            startTime?: number;
        }
    }
}
