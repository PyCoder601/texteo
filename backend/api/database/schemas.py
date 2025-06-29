from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, constr


# -------------------------
# AUTHENTIFICATION
# -------------------------


class LoginSchema(BaseModel):
    username: str
    password: str


class RegisterSchema(BaseModel):
    username: str
    email: EmailStr
    password: constr(min_length=6)
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
    created_at: Optional[datetime] = None


class UserResponse(BaseModel):
    user: UserBase
    token: str


# -------------------------
# CONTACT
# -------------------------


class ContactCreate(BaseModel):
    contact_id: int
    alias_name: Optional[str] = None


class ContactOut(BaseModel):
    id: int
    owner_id: int
    contact_id: int
    alias_name: Optional[str]


# -------------------------
# CONVERSATION
# -------------------------


class ConversationCreate(BaseModel):
    user_id: int


class ConversationOut(BaseModel):
    id: int
    user1_id: int
    user2_id: int
    created_at: datetime


# -------------------------
# MESSAGE
# -------------------------


class MessageCreate(BaseModel):
    conversation_id: int
    content: str


class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    created_at: datetime
    is_read: bool


# -------------------------
# NOTIFICATION
# -------------------------


class NotificationOut(BaseModel):
    id: int
    to_user_id: int
    message_id: int
    is_seen: bool
    created_at: datetime
