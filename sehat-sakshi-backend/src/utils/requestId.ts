import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique request ID using UUID v4
 * @returns A unique request ID string
 */
export const generateRequestId = (): string => {
    return uuidv4();
};

/**
 * Extracts request ID from headers or generates a new one
 * @param headers - Request headers object
 * @returns The request ID
 */
export const getOrCreateRequestId = (headers: Record<string, string | string[] | undefined>): string => {
    const existingId = headers['x-request-id'] || headers['x-correlation-id'];

    if (typeof existingId === 'string' && existingId.trim()) {
        return existingId.trim();
    }

    return generateRequestId();
};

/**
 * Formats request ID for logging display
 * @param requestId - The request ID
 * @returns Formatted request ID string
 */
export const formatRequestId = (requestId: string): string => {
    return `[${requestId.substring(0, 8)}]`;
};
