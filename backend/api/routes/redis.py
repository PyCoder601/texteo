import redis.asyncio as redis

async_redis = redis.Redis(host="localhost", port=6379, decode_responses=True)
