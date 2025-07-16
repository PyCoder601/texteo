import os
from dotenv import load_dotenv
from passlib.context import CryptContext

from backend.api.routes.redis import async_redis

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

load_dotenv()


def avatar_url(url):
    print("url", url)
    return f'{os.getenv("BACKEND_URL")}{url}'


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


async def set_is_online(user_id: int, is_online: bool):
    await async_redis.set(f"user:{user_id}:online", 1 if is_online else 0)
    await async_redis.expire(f"user:{user_id}:online", 60)


async def get_is_online(user_id: int):
    return await async_redis.get(f"user:{user_id}:online") == True
