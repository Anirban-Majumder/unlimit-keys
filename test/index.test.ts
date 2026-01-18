
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLeastUsedKey } from '../src/schema/getLeastUsedKey';

// Mock the redis module
const mockRedisEval = vi.fn();

vi.mock('../src/schema/redis', () => ({
    redis: {
        eval: (...args: any[]) => mockRedisEval(...args),
    },
}));

describe('getLeastUsedKey', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return the least used key when available', async () => {
        mockRedisEval.mockResolvedValue('test-key-1');

        const key = await getLeastUsedKey();

        expect(key).toBe('test-key-1');
        expect(mockRedisEval).toHaveBeenCalledTimes(1);

        // Check if the script argument was passed (simplified check)
        expect(mockRedisEval.mock.calls[0][0]).toContain('redis.call(\'zrange\'');
    });

    it('should throw an error if no keys are found (nil return from lua)', async () => {
        mockRedisEval.mockResolvedValue(null);

        await expect(getLeastUsedKey()).rejects.toThrow('No API keys found');
    });
});
