from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


# -------------------------
# AUTHENTIFICATION
# -------------------------


class LoginSchema(BaseModel):
    username: str
    password: str


class RegisterSchema(BaseModel):
    username: str
    email: EmailStr
    password: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    token: str


# -------------------------
# UTILISATEUR
# -------------------------


class UserBase(BaseModel):
    id: int
    username: str
    email: EmailStr
    avatar_url: Optional[str] = None
    bio: Optional[str] = None


class UserResponse(BaseModel):
    user: UserBase
    token: str


# -------------------------
# CONVERSATION
# -------------------------


class FriendCreate(BaseModel):
    username: str


class FriendResponse(BaseModel):
    id: int
    username: str
    avatar_url: Optional[str] = None


class ConversationCreate(BaseModel):
    user_id: int


class ConversationResponse(BaseModel):
    id: int
    friend: Optional[FriendResponse] = None
    last_message_at: Optional[str | datetime] = None
    last_message: Optional["MessageResponse"] = None


# -------------------------
# MESSAGE
# -------------------------


class MessageCreate(BaseModel):
    conversation_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    content: str
    created_at: str | datetime


# -------------------------
# NOTIFICATION
# -------------------------


class NotificationOut(BaseModel):
    id: int
    to_user_id: int
    message_id: int
    is_seen: bool
    created_at: datetime
