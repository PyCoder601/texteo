from fastapi import APIRouter, HTTPException, Request
from sqlmodel import select
from starlette.responses import JSONResponse

from backend.api.database.models import User
from backend.api.database.schemas import (
    UserResponse,
    LoginSchema,
    TokenResponse,
    RegisterSchema,
)
from backend.api.utils.deps import AsyncSessionDep, CurrUserDep
from backend.api.utils.jwt import (
    create_access_token,
    create_refresh_token,
    verify_token,
)
from backend.api.utils.password import verify_password, hash_password

router = APIRouter()


@router.post("/login", response_model=UserResponse)
async def login(session: AsyncSessionDep, data: LoginSchema):
    username = data.username
    user = await session.exec(select(User).where(User.username == username))  # type: ignore
    print(user)
    user = user.first()
    print(user)
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
async def register(session: AsyncSessionDep, data: RegisterSchema):
    existing = await session.exec(
        select(User).where(User.username == data.username, User.email == data.email)
    )
    if existing.first():
        raise HTTPException(
            status_code=400, detail="Nom d'utilisateur ou email existant."
        )

    new_user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password),
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


@router.get("/user/{user_id]", response_model=UserResponse)
async def get_me(session: AsyncSessionDep, current_user: CurrUserDep, user_id: int):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.to_dict()
