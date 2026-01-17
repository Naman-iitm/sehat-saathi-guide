import { auditLogger } from '../config/logger';
import { AuditLogData, AuditAction } from '../types/logger.types';
import { Request } from 'express';

/**
 * Get client IP from request
 */
const getClientIp = (req?: Request): string | undefined => {
    if (!req) return undefined;

    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress;
};

/**
 * Log an audit event
 * @param data - Audit log data
 */
export const logAuditEvent = (data: Omit<AuditLogData, 'timestamp'>): void => {
    const auditData: AuditLogData = {
        ...data,
        timestamp: new Date().toISOString(),
    };

    const logLevel = data.success ? 'info' : 'warn';
    const actionStr = data.success ? 'SUCCESS' : 'FAILED';

    auditLogger.log(logLevel, `[AUDIT] ${data.action} ${actionStr} - User: ${data.userId}, Resource: ${data.resource}`, {
        type: 'audit',
        ...auditData,
    });
};

/**
 * Log authentication event
 */
export const logAuthEvent = (
    action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'REGISTER' | 'PASSWORD_CHANGE',
    userId: string,
    success: boolean,
    req?: Request,
    details?: Record<string, unknown>
): void => {
    logAuditEvent({
        requestId: req?.id,
        userId,
        action,
        resource: 'auth',
        ip: getClientIp(req),
        details,
        success,
    });
};

/**
 * Log data modification event
 */
export const logDataEvent = (
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ',
    userId: string,
    resource: string,
    resourceId?: string,
    req?: Request,
    details?: Record<string, unknown>
): void => {
    logAuditEvent({
        requestId: req?.id,
        userId,
        action,
        resource,
        resourceId,
        ip: getClientIp(req),
        details,
        success: true,
    });
};

/**
 * Log profile update event
 */
export const logProfileUpdate = (
    userId: string,
    req?: Request,
    updatedFields?: string[]
): void => {
    logAuditEvent({
        requestId: req?.id,
        userId,
        action: 'PROFILE_UPDATE',
        resource: 'user',
        resourceId: userId,
        ip: getClientIp(req),
        details: { updatedFields },
        success: true,
    });
};

/**
 * Log failed authentication attempt
 */
export const logFailedAuth = (
    email: string,
    reason: string,
    req?: Request
): void => {
    auditLogger.warn(`[SECURITY] Failed authentication attempt for ${email}: ${reason}`, {
        type: 'security',
        email,
        reason,
        ip: getClientIp(req),
        userAgent: req?.headers['user-agent'],
        requestId: req?.id,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Log suspicious activity
 */
export const logSuspiciousActivity = (
    description: string,
    req?: Request,
    details?: Record<string, unknown>
): void => {
    auditLogger.warn(`[SECURITY] Suspicious activity: ${description}`, {
        type: 'security_alert',
        description,
        ip: getClientIp(req),
        userAgent: req?.headers['user-agent'],
        url: req?.originalUrl,
        method: req?.method,
        requestId: req?.id,
        details,
        timestamp: new Date().toISOString(),
    });
};

export default {
    logAuditEvent,
    logAuthEvent,
    logDataEvent,
    logProfileUpdate,
    logFailedAuth,
    logSuspiciousActivity,
};
