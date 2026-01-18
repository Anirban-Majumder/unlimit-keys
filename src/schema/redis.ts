import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';

// Load env files silently - .env.local overrides .env
dotenv.config({ path: '.env', quiet: true });
dotenv.config({ path: '.env.local', quiet: true });

const { REDIS_URL, REDIS_TOKEN } = process.env;

if (!REDIS_URL || !REDIS_TOKEN) {
  throw new Error('Missing Redis credentials. Please set REDIS_URL and REDIS_TOKEN.');
}

export const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});
