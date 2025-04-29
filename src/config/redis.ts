import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    console.error(`Retrying Redis connection (${times})...`);
    return Math.min(times * 100, 3000); // Retry with a maximum of 3 seconds
  },
});

const initializeRedis = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    redisClient.on('connect', () => {
      console.log('Connected to Redis');
      resolve();
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
      reject(err);
    });
  });
};

export { redisClient, initializeRedis };