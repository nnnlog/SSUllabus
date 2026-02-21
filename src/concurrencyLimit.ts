import { Context, Next } from 'hono';
import Queue from 'yocto-queue';

export const concurrencyLimitMiddleware = (maxConcurrent: number) => {
  let activeRequests = 0;
  const queue = new Queue<() => void>();

  return async (c: Context, next: Next) => {
    if (activeRequests >= maxConcurrent) {
      await new Promise<void>((resolve) => {
        queue.enqueue(resolve);
      });
    } else {
      activeRequests++;
    }

    try {
      await next();
    } finally {
      if (queue.size > 0) {
        const nextInLine = queue.dequeue();
        if (nextInLine) {
          nextInLine();
        }
      } else {
        activeRequests--;
      }
    }
  };
};
