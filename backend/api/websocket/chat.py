import asyncio

import json
import os

from datetime import datetime

from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect

from backend.api.database.models import Message, User
from backend.api.routes.redis import async_redis
from backend.api.utils.deps import get_current_user, AsyncSessionDep

router = APIRouter()
active_connections: dict[int, list[WebSocket]] = {}

UPLOAD_FOLDER = "static/uploads/messages"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


async def handle_text_message(
        session: AsyncSessionDep, conversation_id: int, user: User, data: dict
):
    content = data.get("content")
    new_message = Message(
        conversation_id=conversation_id,
        sender_id=user.id,
        content=content,
        type="text",
    )
    session.add(new_message)
    await session.commit()
    await session.refresh(new_message)
    return new_message


async def handle_binary_message(
        session: AsyncSessionDep, conversation_id: int, user: User, message_bytes: bytes
):
    try:
        filename = f"{user.id}_{int(datetime.now().timestamp())}.jpg"
        path = f"static/uploads/messages/{filename}"
        with open(path, "wb") as f:
            f.write(message_bytes)

        new_message = Message(
            conversation_id=conversation_id,
            sender_id=user.id,
            content=f"/{path}",
            type="photo",
        )
        session.add(new_message)
        await session.commit()
        await session.refresh(new_message)
        return new_message
    except Exception as e:
        print(f"Error processing image message: {e}")
        return None


@router.websocket("/chat/{conversation_id}")
async def chat(websocket: WebSocket, conversation_id: int, session: AsyncSessionDep):
    await websocket.accept(subprotocol="chat")
    token = websocket.query_params.get("token")

    user_dict = await get_current_user(token)
    user = await session.get(User, user_dict["id"])
    if not user:
        await websocket.close(code=4001)
        return

    if conversation_id not in active_connections:
        active_connections[conversation_id] = []
    active_connections[conversation_id].append(websocket)

    try:
        while True:
            message = await websocket.receive()

            if message.get("type") == "websocket.disconnect":
                break

            if "text" in message:
                data = json.loads(message["text"])
                new_message = await handle_text_message(
                    session, conversation_id, user, data
                )

            elif "bytes" in message and message["bytes"]:
                new_message = await handle_binary_message(
                    session, conversation_id, user, message["bytes"]
                )

            else:
                print("Unsupported message type or empty payload.")
                continue

            if new_message:
                for ws in active_connections[conversation_id]:
                    await ws.send_json(new_message.to_dict())

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        active_connections[conversation_id].remove(websocket)
        if not active_connections[conversation_id]:
            del active_connections[conversation_id]

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
