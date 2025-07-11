from fastapi import APIRouter, HTTPException
from sqlmodel import select
from starlette.responses import JSONResponse
from dotenv import load_dotenv

from backend.api.database.models import Conversation, Message, User
from backend.api.database.schemas import (
    ConversationResponse,
    MessageResponse,
    FriendResponse,
    FriendCreate,
)
from backend.api.utils.deps import AsyncSessionDep, CurrUserDep
from backend.api.utils.get_avatar_url import avatar_url

router = APIRouter()
load_dotenv()


@router.get("/conversations", response_model=list[ConversationResponse])
async def get_conversations(session: AsyncSessionDep, current_user: CurrUserDep):
    user_id = current_user["id"]

    result = await session.exec(
        select(Conversation).where(
            (Conversation.user1_id == user_id) | (Conversation.user2_id == user_id)
        )
    )
    conversations = result.all()

    responses = []
    for conv in conversations:
        msg_result = await session.exec(
            select(Message)
            .where(Message.conversation_id == conv.id)
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        last_msg = msg_result.first()

        responses.append(
            ConversationResponse(
                id=conv.id,
                friend=(
                    FriendResponse(
                        id=conv.user1.id,
                        username=conv.user1.username,
                        avatar_url=avatar_url(conv.user1.avatar_url),
                    )
                    if conv.user1.id != user_id
                    else FriendResponse(
                        id=conv.user2.id,
                        username=conv.user2.username,
                        avatar_url=avatar_url(conv.user2.avatar_url),
                    )
                ),
                last_message=last_msg.to_dict() if last_msg else None,
                last_message_at=last_msg.created_at.isoformat() if last_msg else None,
            )
        )
    return responses


@router.delete("/conversation/{conversation_id}", status_code=204)
async def delete_conversation(
        conversation_id: int,
        session: AsyncSessionDep,
        current_user: CurrUserDep,
):
    conversations = await session.exec(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conversation = conversations.first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    await session.delete(conversation)
    await session.commit()
    return JSONResponse(
        {"message": "Conversation deleted successfully"}, status_code=204
    )


@router.get("/conversations/{id}/messages", response_model=list[MessageResponse])
async def get_messages(id: int, session: AsyncSessionDep):
    result = await session.exec(
        select(Message)
        .where(Message.conversation_id == id)
        .order_by(Message.created_at)
    )
    return [message.to_dict() for message in result.all()]


@router.post("/conversation", response_model=ConversationResponse, status_code=201)
async def create_conversation(
        session: AsyncSessionDep, current_user: CurrUserDep, data: FriendCreate
):
    friend = await session.exec(select(User).where(User.username == data.username))
    friend = friend.first()
    if not friend:
        raise HTTPException(status_code=404, detail="Ce nom d'utilisateur n'existe pas")
    user_id = current_user["id"]
    conversation = Conversation(user1_id=user_id, user2_id=friend.id)
    session.add(conversation)
    await session.commit()
    await session.refresh(conversation)
    response = ConversationResponse(
        id=conversation.id,
        friend=(
            FriendResponse(
                id=conversation.user1.id,
                username=conversation.user1.username,
                avatar_url=avatar_url(conversation.user1.avatar_url),
            )
            if conversation.user1.id != user_id
            else FriendResponse(
                id=conversation.user2.id,
                username=conversation.user2.username,
                avatar_url=avatar_url(conversation.user2.avatar_url),
            )
        ),
        last_message=None,
        last_message_at=None,
    )
    return response
