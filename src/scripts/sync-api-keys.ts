import { redis } from '../schema/redis';

const KEY_SET = 'API_KEYS';

async function syncApiKeys() {
    console.log('🔄 Starting API key sync...\n');

    const keysString = process.env.API_KEYS || '';
    const keysFromEnv = keysString.split(/[\n,]/).map(k => k.trim()).filter(Boolean);

    if (keysFromEnv.length === 0) {
        console.warn('⚠️  No API_KEYS found in environment variables.');
        console.warn('   Make sure API_KEYS is set in your .env or .env.local file.\n');
        return;
    }

    console.log(`📋 Found ${keysFromEnv.length} keys in environment`);

    // Get existing keys
    const keysInRedis = await redis.zrange(KEY_SET, 0, -1) as string[];
    console.log(`🗄️ Found ${keysInRedis.length} keys in Redis\n`);

    // Use Sets for O(1) lookup instead of O(n) array includes
    const envKeySet = new Set(keysFromEnv);
    const redisKeySet = new Set(keysInRedis);

    const keysToAdd = keysFromEnv.filter(k => !redisKeySet.has(k));
    const keysToRemove = keysInRedis.filter(k => !envKeySet.has(k));

    if (keysToAdd.length === 0 && keysToRemove.length === 0) {
        console.log('✅ Keys are already in sync. No changes needed.\n');
        return;
    }

    const pipeline = redis.pipeline();

    if (keysToAdd.length > 0) {
        console.log(`➕ Adding ${keysToAdd.length} new key(s):`);
        for (const key of keysToAdd) {
            console.log(`   • ${key.slice(0, 10)}...${key.slice(-4)}`);
            pipeline.zadd(KEY_SET, { score: 0, member: key });
        }
        console.log();
    }

    if (keysToRemove.length > 0) {
        console.log(`➖ Removing ${keysToRemove.length} stale key(s):`);
        for (const key of keysToRemove) {
            console.log(`   • ${key.slice(0, 10)}...${key.slice(-4)}`);
        }
        pipeline.zrem(KEY_SET, ...keysToRemove);
        console.log();
    }

    await pipeline.exec();
    
    console.log('─'.repeat(40));
    console.log(`✨ Sync complete!`);
    console.log(`   Total keys in pool: ${keysFromEnv.length}`);
    if (keysToAdd.length > 0) console.log(`   Added: ${keysToAdd.length}`);
    if (keysToRemove.length > 0) console.log(`   Removed: ${keysToRemove.length}`);
    console.log();
}

export { syncApiKeys };

// Run directly if this is the main module
if (require.main === module) {
    syncApiKeys().catch((err) => {
        console.error('Error syncing keys:', err);
        process.exit(1);
    });
}
