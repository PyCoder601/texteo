from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlmodel.ext.asyncio.session import AsyncSession

from backend.api.database.db import get_async_session
from backend.api.database.models import User
from backend.api.utils.jwt import verify_token

AsyncSessionDep = Annotated[AsyncSession, Depends(get_async_session)]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token, token_type="access")
    if not payload.get("id"):
        raise HTTPException(status_code=401, detail="Invalid token")
    payload.pop("type")
    payload.pop("exp")
    print(payload)
    return payload


CurrUserDep = Annotated[User, Depends(get_current_user)]
