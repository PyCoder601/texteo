"use client";

import React, {useEffect} from "react";
import { RefObject } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import {fetchMessages, selectCurrentConversation, selectMessages} from "@/redux/conversationSlice";
import {selectUser} from "@/redux/userSlice";
import {MessageType, UserDataType} from "@/utils/types";
import {AppDispatch} from "@/redux/store";

import {formatDate} from "@/utils/helpers";

type ChatWindowProps = {
  ws: RefObject<WebSocket | null>;
};

function ChatWindow({ ws }: ChatWindowProps) {
    const darkMode = useSelector(selectDarkMode);
    const messages: MessageType[] = useSelector(selectMessages);
    const user: UserDataType | null = useSelector(selectUser);
    const currentConversation = useSelector(selectCurrentConversation);
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        if (!currentConversation?.id) return;
        dispatch(fetchMessages(currentConversation.id))
    }, [currentConversation?.id, dispatch]);
    if (!currentConversation) {
        return (
            <div
                className={`flex flex-col h-full w-full items-center justify-center text-center p-8 ${darkMode ? "bg-gradient-to-br" +
                    " from-slate-900 to-gray-800 text-gray-300" : "bg-gradient-to-br from-gray-50 to-blue-50 " +
                    "text-gray-600"}`}>

                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Bienvenue sur
                    Texteo</h1>
                <p className="text-lg">Sélectionnez une conversation pour commencer à discuter.</p>
                <div
                    className={`mt-8 border-t w-1/2 mx-auto ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>
                <p className="mt-4 text-sm text-gray-500">
                    Envoyez et recevez des messages en temps réel
                </p>
            </div>
        )
    }

    return (
        <div
            className={`flex flex-col h-full w-full ${darkMode ? "bg-gradient-to-br from-slate-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-blue-50"}`}>
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-6 bg-cover bg-center"
                 style={{backgroundImage: darkMode ? "url('/path-to-dark-whatsapp-bg.png')" : "url('/path-to-light-whatsapp-bg.png')"}}>
                <div className="space-y-4">
                    {
                        messages.map((message) => {
                            return <ChatMessage key={message.id} text={message.content}
                                                time={formatDate(message.created_at)}
                                                type={message.type}
                                                reactionProp={message.reaction}
                                                id={message.id}
                                                sent={message.sender_id === user?.id}
                                                socketRef={ws}
                            />
                        })
                    }
                </div>
            </div>
            <ChatInput socketRef={ws}/>
        </div>
    );
}

export default ChatWindow;