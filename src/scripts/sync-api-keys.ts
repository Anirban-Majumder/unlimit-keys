import 'dotenv/config';
import { Redis } from '@upstash/redis';

// Note: checking for properties on process.env needs type assertions or simply checking existence
if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
    throw new Error('Missing Upstash Redis credentials in .env file');
}

const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
});

const KEY_SET = 'ru_api_keys';

async function syncApiKeys() {
    console.log('Syncing API keys from RU_API_KEYS...');

    const keysString = process.env.RU_API_KEYS || '';
    const keysFromEnv = keysString.split(/[\n,]/).map(k => k.trim()).filter(Boolean);

    if (keysFromEnv.length === 0) {
        console.warn('No RU_API_KEYS found in environment variables.');
        return;
    }

    const pipeline = redis.pipeline();

    // Get existing keys
    const keysInRedis = await redis.zrange(KEY_SET, 0, -1) as string[];

    // Determine additions and removals
    const keysToAdd = keysFromEnv.filter(k => !keysInRedis.includes(k));
    const keysToRemove = keysInRedis.filter(k => !keysFromEnv.includes(k));

    if (keysToAdd.length > 0) {
        console.log(`Adding ${keysToAdd.length} new keys.`);
        for (const key of keysToAdd) {
            // Add with score 0 (least used)
            pipeline.zadd(KEY_SET, { score: 0, member: key });
        }
    }

    if (keysToRemove.length > 0) {
        console.log(`Removing ${keysToRemove.length} stale keys.`);
        pipeline.zrem(KEY_SET, ...keysToRemove);
    }

    if (keysToAdd.length === 0 && keysToRemove.length === 0) {
        console.log('Keys are already in sync.');
    } else {
        await pipeline.exec();
        console.log('Sync complete.');
    }
}

syncApiKeys().catch((err) => {
    console.error('Error syncing keys:', err);
    process.exit(1);
});
