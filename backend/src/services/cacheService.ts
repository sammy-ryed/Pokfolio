import Redis from 'ioredis';
import { env } from '../config/env.js';

class CacheService {
  private redis: Redis | null = null;

  constructor() {
    if (env.REDIS_URL) {
      try {
        let hasWarned = false;
        
        this.redis = new Redis(env.REDIS_URL, {
          maxRetriesPerRequest: 0,
          retryStrategy: () => null, // Stop retrying immediately
        });
        
        this.redis.on('error', (err) => {
          if (!hasWarned) {
            console.warn('Redis cache connection error. Disabling cache:', err.message);
            hasWarned = true;
            this.redis = null;
          }
        });
      } catch (err) {
        console.warn('Failed to initialize Redis. Cache will be disabled.', err);
      }
    } else {
      console.log('REDIS_URL not set. Caching is disabled.');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn(`Cache get failed for key ${key}:`, err);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.warn(`Cache set failed for key ${key}:`, err);
    }
  }
}

export const cacheService = new CacheService();
