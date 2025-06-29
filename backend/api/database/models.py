from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field, Relationship


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

    contacts_added: list["Contact"] = Relationship(
        back_populates="adder",
        sa_relationship_kwargs={"foreign_keys": "[Contact.user_id]"},
    )
    in_contacts_of: list["Contact"] = Relationship(
        back_populates="contact",
        sa_relationship_kwargs={"foreign_keys": "[Contact.contact_id]"},
    )
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
            "avatar_url": self.avatar_url,
            "bio": self.bio,
            "created_at": self.created_at.isoformat(),
        }


# ---------------------
# Contact
# ---------------------
class Contact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    contact_id: int = Field(foreign_key="user.id")
    alias_name: Optional[str] = None

    adder: Optional["User"] = Relationship(
        back_populates="contacts_added",
        sa_relationship_kwargs={"foreign_keys": "[Contact.user_id]"},
    )
    contact: Optional["User"] = Relationship(
        back_populates="in_contacts_of",
        sa_relationship_kwargs={"foreign_keys": "[Contact.contact_id]"},
    )


# ---------------------
# Conversation
# ---------------------
class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user1_id: int = Field(foreign_key="user.id")
    user2_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.now)

    user1: Optional[User] = Relationship(
        back_populates="conversations1",
        sa_relationship_kwargs={"foreign_keys": "[Conversation.user1_id]"},
    )
    user2: Optional[User] = Relationship(
        back_populates="conversations2",
        sa_relationship_kwargs={"foreign_keys": "[Conversation.user2_id]"},
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
