import os

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from dotenv import load_dotenv
from sqlmodel.ext.asyncio.session import AsyncSession

load_dotenv()

engine = create_async_engine(os.getenv("DATABASE_ASYNC_URL"))

async_session = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


async def get_async_session():
    async with async_session() as session:
        yield session
