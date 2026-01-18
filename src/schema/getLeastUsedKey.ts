import { redis } from './redis';

const KEY_SET = 'ru_api_keys';

/**
 * Fetches the least recently used API key from the global pool.
 * Automatically updates the key's usage timestamp.
 *
 * @returns The API key to be used.
 * @throws Will throw an error if no keys are found.
 */
export async function getLeastUsedKey(): Promise<string> {
    const currentTime = Date.now() / 1000;

    // Atomic Lua script:
    // 1. Get the key with the lowest score (least recently used)
    // 2. If a key exists, update its score to current time
    // 3. Return the key
    const script = `
        local key = redis.call('zrange', KEYS[1], 0, 0)[1]
        if key then
            redis.call('zadd', KEYS[1], ARGV[1], key)
            return key
        else
            return nil
        end
    `;

    const key = await redis.eval(script, [KEY_SET], [currentTime]) as string | null;

    if (!key) {
        throw new Error('No API keys found in Redis. Please check your RU_API_KEYS environment variable and run the sync script.');
    }

    return key;
}
