from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.sql.annotation import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession
from starlette.responses import JSONResponse

from backend.api.database.db import get_async_session
from backend.api.database.models import User
from backend.api.database.schemas import UserResponse, LoginSchema, TokenResponse
from backend.api.utils.jwt import (
    create_access_token,
    create_refresh_token,
    verify_token,
)
from backend.api.utils.password import verify_password

router = APIRouter()

AsyncSessionDep = Annotated[AsyncSession, Depends(get_async_session())]


@router.post("/login", response_model=UserResponse)
async def login(session: AsyncSessionDep, data: LoginSchema):
    username = data.username
    user = await session.execute(
        session.query(User).filter(User.username == username)
    ).scalar_one_or_none()
    if user is None or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401, detail="Nom d'utilisateur ou mot de passe incorrecte"
        )
    user_data = user.to_dict()
    access_token = create_access_token(user_data)
    refresh_token = create_refresh_token(user_data)

    response = JSONResponse(
        {
            "token": access_token,
            "user": user_data,
        }
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite=None,
        secure=True,
    )

    return response


@router.post("/register", response_model=UserResponse)
async def register(session: AsyncSessionDep, data: LoginSchema):
    user = await session.execute(
        session.query(User).filter(User.username == data.username)
    ).scalar_one_or_none()
    if user:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà utilisé")
    user = await session.execute(
        session.query(User).filter(User.email == data.email)
    ).scalar_one_or_none()
    if user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    new_user = User(
        username=data.username,
        email=data.email,
        password=data.password,
        avatar_url=data.avatar_url,
        bio=data.bio,
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    user_data = new_user.to_dict()

    access_token = create_access_token(user_data)
    refresh_token = create_refresh_token(user_data)

    response = JSONResponse(
        {
            "token": access_token,
            "user": user_data,
        }
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite=None,
        secure=True,
    )
    return response


@router.post("/logout")
async def logout(request: Request):
    response = JSONResponse({"message": "Logout successful"})
    response.delete_cookie(key="refresh_token")
    return response


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token_func(request: Request):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=400, detail="No refresh token")
    payload = verify_token(refresh_token, token_type="refresh")
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload)

    response = JSONResponse(
        {
            "token": access_token,
        }
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        max_age=7 * 24 * 60 * 60,
        samesite=None,
    )

    return response
