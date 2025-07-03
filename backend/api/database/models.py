from datetime import datetime
from typing import Optional
import os

from sqlmodel import SQLModel, Field, Relationship
from dotenv import load_dotenv

load_dotenv()


# ---------------------
# User
# ---------------------
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    password: str
    avatar_url: Optional[str] = Field(default=None)
    bio: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    last_seen: Optional[datetime] = Field(default=None)

    conversations1: list["Conversation"] = Relationship(
        back_populates="user1",
        sa_relationship_kwargs={"foreign_keys": "[Conversation.user1_id]"},
    )
    conversations2: list["Conversation"] = Relationship(
        back_populates="user2",
        sa_relationship_kwargs={"foreign_keys": "[Conversation.user2_id]"},
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "avatar_url": f"{os.getenv("BACKEND_URL")}{self.avatar_url}",
            "bio": self.bio,
            "last_seen": self.last_seen.isoformat() if self.last_seen else None,
        }


# ---------------------
# Conversation
# ---------------------
class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user1_id: int = Field(foreign_key="user.id")
    user2_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.now)
    last_message_at: Optional[datetime] = Field(default=None)

    user1: Optional[User] = Relationship(
        back_populates="conversations1",
        sa_relationship_kwargs={
            "foreign_keys": "[Conversation.user1_id]",
            "lazy": "joined",
        },
    )
    user2: Optional[User] = Relationship(
        back_populates="conversations2",
        sa_relationship_kwargs={
            "foreign_keys": "[Conversation.user2_id]",
            "lazy": "joined",
        },
    )
    messages: list["Message"] = Relationship(back_populates="conversation")


# ---------------------
# Message
# ---------------------
class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    sender_id: int = Field(foreign_key="user.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.now)
    is_read: bool = Field(default=False)

    conversation: Optional[Conversation] = Relationship(back_populates="messages")

    def to_dict(self):
        return {
            "id": self.id,
            "conversation_id": self.conversation_id,
            "sender_id": self.sender_id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "is_read": self.is_read,
        }
