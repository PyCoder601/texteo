import base64
import json
import os
import re

from datetime import datetime

from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect

from backend.api.database.models import Message, User, Conversation
from backend.api.routes.redis import async_redis
from backend.api.utils.deps import get_current_user, AsyncSessionDep
from backend.api.utils.helpers import set_is_online

active_connections_in_discussion: dict[int, list[tuple[WebSocket, int]]] = {}
online_users: dict[int, WebSocket] = {}

router = APIRouter()


UPLOAD_FOLDER = "static/uploads/messages"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def is_user_connected(discussion_id: int, user_id: int) -> bool:
    connections = active_connections_in_discussion.get(discussion_id, [])
    return any(uid == user_id for _, uid in connections)


async def handle_text_message(
    session: AsyncSessionDep, conversation_id: int, user: User, content: str
):
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


async def handle_base64_photo_message(
    session: AsyncSessionDep,
    conversation_id: int,
    user: User,
    base64_string: str,
):
    try:
        header, encoded = base64_string.split(",", 1)
        file_ext = "jpg"
        match = re.search(r"data:image/(\w+);base64", header)
        if match:
            file_ext = match.group(1)

        image_data = base64.b64decode(encoded)

        filename = f"{user.id}_{int(datetime.now().timestamp())}.{file_ext}"
        path = f"static/uploads/messages/{filename}"
        with open(path, "wb") as f:
            f.write(image_data)

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
        print(f"Error processing base64 photo message: {e}")
        return None


@router.websocket("/chat/{conversation_id}")
async def chat(websocket: WebSocket, conversation_id: int, session: AsyncSessionDep):
    await websocket.accept(subprotocol="chat")
    token = websocket.query_params.get("token")

    user_dict = await get_current_user(token)
    user = await session.get(User, user_dict["id"])

    await set_is_online(user.id, True)

    if not user:
        await websocket.close(code=4001)
        return

    if conversation_id not in active_connections_in_discussion:
        active_connections_in_discussion[conversation_id] = []
    active_connections_in_discussion[conversation_id].append((websocket, user.id))

    online_users[user.id] = websocket

    try:
        while True:
            message = await websocket.receive()

            if message.get("type") == "websocket.disconnect":
                break

            if "text" in message:
                data = json.loads(message["text"])

                if data.get("type") == "message":

                    new_message = None

                    # Envoi text: Message
                    if "message_text" in data:
                        content = data.get("message_text")
                        new_message = await handle_text_message(
                            session, conversation_id, user, content
                        )

                    # Envoi photo: Message
                    if "photo" in data:
                        base64image = data.get("photo")
                        new_message = await handle_base64_photo_message(
                            session, conversation_id, user, base64image
                        )

                    for ws, _ in active_connections_in_discussion[conversation_id]:
                        await ws.send_json(
                            {
                                "new_message_data": new_message.to_dict(),
                                "type": "new_message",
                            }
                        )

                    # si nouveau message, envoie notification au receiver
                    receiver_id = data.get("receiver_id")
                    if not is_user_connected(conversation_id, receiver_id):
                        ws = online_users.get(receiver_id)
                        if ws:
                            await ws.send_json(
                                {
                                    "type": "new_conversation",
                                }
                            )

                # text: supprimer un message
                elif data.get("type") == "supprimer_message":
                    message_id = data.get("message_id")
                    message = await session.get(Message, message_id)

                    message.type = "deleted"
                    await session.commit()
                    await session.refresh(message)

                    for ws, _ in active_connections_in_discussion[conversation_id]:
                        await ws.send_json(
                            {
                                "message_data": message.to_dict(),
                                "type": "supprimer_message",
                            }
                        )

                # text: supprimer conversation
                elif data.get("type") == "supprimer_conversation":
                    conversation_id_params = data.get("conversation_id")

                    conversation = await session.get(
                        Conversation, conversation_id_params
                    )

                    await session.delete(conversation)
                    await session.commit()

                    for ws, _ in active_connections_in_discussion[conversation_id]:
                        await ws.send_json(
                            {
                                "type": "supprimer_conversation",
                                "conversation_id": conversation_id_params,
                            }
                        )

                    receiver_id = data.get("receiver_id")
                    if not is_user_connected(conversation_id, receiver_id):
                        ws = online_users.get(receiver_id)
                        if ws:
                            await ws.send_json(
                                {
                                    "type": "supprimer_conversation",
                                    "conversation_id": conversation_id_params,
                                }
                            )

                # text: reaction
                else:
                    message_id = data.get("message_id")
                    reaction = data.get("reaction")
                    message = await session.get(Message, message_id)

                    message.reaction = reaction
                    await session.commit()
                    await session.refresh(message)

                    for ws, _ in active_connections_in_discussion[conversation_id]:
                        await ws.send_json(
                            {"message_data": message.to_dict(), "type": "reaction"}
                        )

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        active_connections_in_discussion[conversation_id].remove((websocket, user.id))
        if not active_connections_in_discussion[conversation_id]:
            del active_connections_in_discussion[conversation_id]

        del online_users[user.id]
        await async_redis.set(f"user:{user.id}:online", 0)
        user.last_seen = datetime.now()
        await session.commit()
