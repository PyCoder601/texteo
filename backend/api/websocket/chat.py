import asyncio
from datetime import datetime

from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect

from backend.api.database.models import Message, User
from backend.api.routes.redis import async_redis
from backend.api.utils.deps import get_current_user, AsyncSessionDep

router = APIRouter()
active_connections: dict[int, list[WebSocket]] = {}


@router.websocket("/chat/{conversation_id}")
async def chat(websocket: WebSocket, conversation_id: int, session: AsyncSessionDep):
    conversation_id = int(conversation_id)
    await websocket.accept(subprotocol="chat")
    token = websocket.query_params.get("token")
    user_dict = await get_current_user(token)
    user = await session.get(User, user_dict["id"])
    if not user:
        await websocket.close()
        return

    if conversation_id not in active_connections:
        active_connections[conversation_id] = []
    active_connections[conversation_id].append(websocket)
    await async_redis.set(f"user:{user.id}:online", 1)
    await async_redis.expire(f"user:{user.id}:online", 60)

    try:
        while True:
            data = await websocket.receive_json()
            content = data.get("content")
            new_message = Message(
                conversation_id=conversation_id,
                sender_id=user.id,
                content=content,
            )
            session.add(new_message)
            await session.commit()
            await session.refresh(new_message)

            for ws in active_connections[conversation_id]:
                await ws.send_json(
                    {
                        "sender_id": user.id,
                        "content": content,
                        "created_at": new_message.created_at.isoformat(),
                    }
                )

    except WebSocketDisconnect:
        active_connections[conversation_id].remove(websocket)

        await async_redis.set(f"user:{user.id}:online", 0)
        user.last_seen = datetime.now()
        await session.commit()


@router.websocket("/set-online/")
async def set_online(websocket: WebSocket, session: AsyncSessionDep):
    await websocket.accept()
    token = websocket.headers.get("Authorization").replace("Bearer ", "")
    user = await get_current_user(token)
    user = await session.get(User, user["id"])
    if not user:
        await websocket.close(code=401)
        return
    await async_redis.set(f"user:{user.id}:online", 1)
    await async_redis.expire(f"user:{user.id}:online", 60)

    try:
        while True:
            await async_redis.expire(f"user:{user.id}:online", 60)
            await asyncio.sleep(30)

    except WebSocketDisconnect:
        await async_redis.set(f"user:{user.id}:online", 0)
        user.last_seen = datetime.now()
        await session.commit()
