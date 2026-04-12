import { useCallback, useEffect, useRef, useState } from 'react';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface QueuedRequest<T> {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
}

class RequestQueue {
  private queue: QueuedRequest<any>[] = [];
  private processing = false;
  private requestCount = 0;
  private windowStart = Date.now();
  private config: RateLimitConfig;
  private processingTimeout: NodeJS.Timeout | null = null;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async enqueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        execute: request,
        resolve: resolve as any,
        reject,
      });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;

    const now = Date.now();
    if (now - this.windowStart >= this.config.windowMs) {
      this.requestCount = 0;
      this.windowStart = now;
    }

    if (this.requestCount >= this.config.maxRequests) {
      const waitTime = this.config.windowMs - (now - this.windowStart);
      this.processingTimeout = setTimeout(() => this.processQueue(), waitTime);
      return;
    }

    const request = this.queue.shift();
    if (!request) return;

    this.processing = true;
    this.requestCount++;

    try {
      const result = await request.execute();
      request.resolve(result);
    } catch (error) {
      request.reject(error as Error);
    }

    this.processing = false;
    this.processQueue();
  }

  clear(): void {
    this.queue = [];
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
    }
  }
}

interface AuditLogEntry {
  id: string;
  action: string;
  userId?: string;
  resource?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 1000;
  private listeners: Set<(log: AuditLogEntry) => void> = new Set();

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ipAddress: typeof window !== 'undefined' ? window.location.hostname : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.logs.unshift(fullEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    this.listeners.forEach(listener => listener(fullEntry));

    // Send to backend in production
    if (import.meta.env.PROD) {
      this.sendToBackend(fullEntry);
    }
  }

  private async sendToBackend(entry: AuditLogEntry): Promise<void> {
    try {
      // Replace with actual audit endpoint
      console.log('[Audit]', entry);
    } catch (error) {
      console.error('Failed to send audit log:', error);
    }
  }

  getLogs(filter?: Partial<AuditLogEntry>): AuditLogEntry[] {
    if (!filter) return [...this.logs];
    return this.logs.filter(log =>
      Object.entries(filter).every(([key, value]) =>
        (log as any)[key] === value
      )
    );
  }

  subscribe(listener: (log: AuditLogEntry) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  clear(): void {
    this.logs = [];
  }
}

export const auditLogger = new AuditLogger();

// React hooks for these utilities
export function useRequestQueue(config: RateLimitConfig) {
  const queueRef = useRef(new RequestQueue(config));

  const enqueue = useCallback(<T>(request: () => Promise<T>) => {
    return queueRef.current.enqueue(request);
  }, []);

  const clear = useCallback(() => {
    queueRef.current.clear();
  }, []);

  return { enqueue, clear };
}

export function useAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setLogs(auditLogger.getLogs());
    
    const unsubscribe = auditLogger.subscribe((log) => {
      setLogs(prev => [log, ...prev]);
    });

    return unsubscribe;
  }, []);

  const getFilteredLogs = useCallback((filter?: Partial<AuditLogEntry>) => {
    return auditLogger.getLogs(filter);
  }, []);

  const clearLogs = useCallback(() => {
    auditLogger.clear();
    setLogs([]);
  }, []);

  return { logs, getFilteredLogs, clearLogs };
}

// Retry utility with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export default withRetry;
