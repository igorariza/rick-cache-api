import { Redis } from 'ioredis';
import { redisClient } from '../config/redis';

class CacheService {
    private client: Redis;

    constructor(redisClient: Redis) {
        this.client = redisClient;
    }

    async getCachedCharacters(key: string): Promise<string | null> {
        const result = await this.client.get(key);
        return result ?? null; // Return the result or null if undefined
    }

    async setCachedCharacters(key: string, value: string, expirationInSeconds: number): Promise<string | null> {
        return await this.client.set(key, value, 'EX', expirationInSeconds); // Use 'EX' for expiration
    }
}

const cacheService = new CacheService(redisClient);

export const getCachedCharacters = cacheService.getCachedCharacters.bind(cacheService);
export const setCachedCharacters = cacheService.setCachedCharacters.bind(cacheService);