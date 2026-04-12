export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'data_access' | 'api_call' | 'config_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  userId?: string;
  ipAddress?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AuditLog extends SecurityEvent {
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000;

  log(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    this.events.unshift(fullEvent);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
    if (event.severity === 'high' || event.severity === 'critical') {
      console.error('[SECURITY]', event);
    }
  }

  getEvents(filter?: Partial<SecurityEvent>): SecurityEvent[] {
    if (!filter) return [...this.events];
    return this.events.filter(e => 
      Object.entries(filter).every(([k, v]) => e[k as keyof SecurityEvent] === v)
    );
  }

  clear(): void {
    this.events = [];
  }
}

export const securityLogger = new SecurityLogger();

export function logSecurityEvent(type: SecurityEvent['type'], message: string, severity: SecurityEvent['severity'] = 'low', metadata?: Record<string, unknown>): void {
  securityLogger.log({ type, message, severity, metadata });
}

export function useAuditLog() {
  const log = (event: Omit<AuditLog, 'id' | 'timestamp'>) => {
    securityLogger.log(event);
  };

  const getLogs = (filter?: Partial<SecurityEvent>) => {
    return securityLogger.getEvents(filter);
  };

  return { log, getLogs };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function validateCSRFToken(token: string, stored: string): boolean {
  if (!token || !stored) return false;
  try {
    const [payload] = stored.split('.');
    if (!payload) return false;
    const decoded = JSON.parse(atob(payload));
    return decoded.csrf === token && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

export function generateCSRFToken(): string {
  const payload = { csrf: crypto.randomUUID(), exp: Date.now() + 3600000 };
  return `${btoa(JSON.stringify(payload))}.signature`;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return true;
  }

  if (record.count >= config.maxRequests) {
    logSecurityEvent('failed_login', `Rate limit exceeded for ${key}`, 'high', { key });
    return false;
  }

  record.count++;
  return true;
}

export function useRateLimit(config: RateLimitConfig) {
  const check = (key: string) => checkRateLimit(key, config);
  return { check };
}