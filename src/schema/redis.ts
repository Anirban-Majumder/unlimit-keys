import { Redis } from '@upstash/redis';

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  throw new Error('Missing Redis credentials. Please set REDIS_URL and REDIS_TOKEN.');
}

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});
