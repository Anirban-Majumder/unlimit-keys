import { redis } from './redis';

const KEY_SET = 'API_KEYS';

const SCRIPT = `
local key = redis.call('zrange', KEYS[1], 0, 0)[1]
if key then
    redis.call('zadd', KEYS[1], ARGV[1], key)
    return key
end
return nil`;

/**
 * Fetches the least recently used API key from the global pool.
 * Atomically updates the key's usage timestamp.
 *
 * @returns The API key to be used.
 * @throws Will throw an error if no keys are found.
 */
export async function getLeastUsedKey(): Promise<string> {
    const key = await redis.eval(SCRIPT, [KEY_SET], [Date.now() / 1000]) as string | null;

    if (!key) {
        throw new Error(
            'unlimit-keys ERROR: No API keys found in Redis.\n' +
            '  1. Set your keys in the API_KEYS environment variable (comma or newline separated)\n' +
            '  2. Run: npx unlimit-keys sync'
        );
    }

    return key;
}
