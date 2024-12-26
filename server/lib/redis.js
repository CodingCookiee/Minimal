import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(`rediss://default:${process.env.UPSTASH_REDIS_TOKEN}@better-tiger-43813.upstash.io:6379`);

export { redis };