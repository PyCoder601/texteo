from http.client import HTTPException

from fastapi import APIRouter

from backend.api.database.models import Message
from backend.api.database.schemas import ReactionCreate, MessageResponse
from backend.api.utils.deps import CurrUserDep, AsyncSessionDep

router = APIRouter()


@router.post("/message/set-reaction", response_model=MessageResponse)
async def set_reaction(
        data: ReactionCreate, current_user: CurrUserDep, session: AsyncSessionDep
):
    message = await session.get(Message, data.message_id)

    if not message:
        return {"error": "Message not found"}

    message.reaction = data.reaction
    await session.commit()
    await session.refresh(message)

    return message.to_dict()


@router.delete("/message/{message_id}", status_code=204)
async def delete_message(
        message_id: int,
        session: AsyncSessionDep,
        current_user: CurrUserDep,
):
    message = await session.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    await session.delete(message)
    await session.commit()
    return {"message": "Message deleted successfully"}
