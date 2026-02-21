import { Context, Next } from 'hono';
import ipRangeCheck from 'ip-range-check';

const DEFAULT_LIMIT = 5;
const DEFAULT_REFILL_INTERVAL_SEC = 3;

interface RateLimitRecord {
  tokens: number;
  lastRefillTime: number;
  expirationTimeMs: number;
}

const store = new Map<string, RateLimitRecord>();

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of store.entries()) {
    if (now - record.lastRefillTime > record.expirationTimeMs) {
      store.delete(ip);
    }
  }
}, 60000);

export const rateLimitMiddleware = (limit: number = DEFAULT_LIMIT, refillIntervalSec: number = DEFAULT_REFILL_INTERVAL_SEC) => {
  const whitelistEnv = process.env.IP_WHITELIST || '';
  const whitelist = whitelistEnv.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0);
  const hasWhitelist = whitelist.length > 0;
  
  const refillRatePerMs = 1 / (refillIntervalSec * 1000);
  const expirationTimeMs = limit * refillIntervalSec * 1000;

  return async (c: Context, next: Next) => {
    let clientIp: string | undefined = (c.env as any)?.incoming?.socket?.remoteAddress;

    if (clientIp && hasWhitelist && ipRangeCheck(clientIp, whitelist)) {
      const xForwardedFor = c.req.header('x-forwarded-for');
      if (xForwardedFor) {
        const commaIndex = xForwardedFor.indexOf(',');
        clientIp = commaIndex !== -1 
          ? xForwardedFor.substring(0, commaIndex).trim() 
          : xForwardedFor.trim();
      }
    }
    
    if (!clientIp) {
        return c.text('Bad Request', 400);
    }

    const now = Date.now();
    let record = store.get(clientIp);

    if (!record) {
      record = {
        tokens: limit,
        lastRefillTime: now,
        expirationTimeMs,
      };
      store.set(clientIp, record);
    } else {
      const timePassed = now - record.lastRefillTime;
      const refillAmount = timePassed * refillRatePerMs;
      record.tokens = Math.min(limit, record.tokens + refillAmount);
      record.lastRefillTime = now;
      record.expirationTimeMs = expirationTimeMs;
    }

    if (record.tokens >= 1) {
      record.tokens -= 1;
      await next();
    } else {
      return c.text('Too Many Requests', 429);
    }
  };
};
