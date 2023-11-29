import type { NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';
import { RateLimitExceedError } from './apiError';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

// from : https://github.com/vercel/next.js/blob/canary/examples/api-routes-rate-limit/utils/rate-limit.ts
/**
 * Rate limit a request by a given key and a given time window
 */
export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (res: NextApiResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader(
          'X-RateLimit-Remaining',
          isRateLimited ? 0 : limit - currentUsage
        );

        return isRateLimited ? reject(new RateLimitExceedError()) : resolve();
      }),
  };
}
