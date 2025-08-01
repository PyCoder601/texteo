import os
import shutil
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Form, UploadFile

from sqlmodel import select
from starlette.responses import JSONResponse

from backend.api.database.models import User
from backend.api.database.schemas import (
    UserResponse,
    LoginSchema,
    TokenResponse,
    RegisterSchema,
    UserBase,
)

from backend.api.utils.deps import AsyncSessionDep, CurrUserDep
from backend.api.utils.jwt import (
    create_access_token,
    create_refresh_token,
    verify_token,
)
from backend.api.utils.helpers import verify_password, hash_password, set_is_online

router = APIRouter()

UPLOAD_FOLDER = "static/uploads/avatars"


@router.post("/login", response_model=UserResponse)
async def login(session: AsyncSessionDep, data: LoginSchema):
    username = data.username
    user = await session.exec(select(User).where(User.username == username))  # type: ignore
    user = user.first()
    if user is None or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=400, detail="Nom d'utilisateur ou mot de passe incorrecte"
        )

    await set_is_online(user.id, True)

    user_data = await user.to_dict()
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

    print(f"user: {user_data}")
    return response


@router.post("/register", response_model=UserResponse)
async def register(session: AsyncSessionDep, data: RegisterSchema):
    existing = await session.exec(
        select(User).where(
            (User.username == data.username) | (User.email == data.email)
        )
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

    user_data = await new_user.to_dict()

    await set_is_online(user_data["id"], True)

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

    await set_is_online(payload["id"], True)

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


@router.get("/user/{user_id}", response_model=UserBase)
async def get_me(session: AsyncSessionDep, current_user: CurrUserDep, user_id: int):
    user = await session.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    response = await user.to_dict()
    print(f"user: {response}")

    return response


@router.patch("/me", response_model=UserBase)
async def update_me(
    session: AsyncSessionDep,
    current_user: CurrUserDep,
    username: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = None,
):
    user = await session.get(User, current_user["id"])

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if username:
        user.username = username
    if bio:
        user.bio = bio

    if profile_picture:
        ext = os.path.splitext(profile_picture.filename)[-1]
        filename = f"{user.id}_{int(datetime.now().timestamp())}{ext}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_picture.file, buffer)  # type: ignore

        user.avatar_url = f"/{file_path}"

    session.add(user)
    await session.commit()
    await session.refresh(user)

    response = await user.to_dict()

    return response
