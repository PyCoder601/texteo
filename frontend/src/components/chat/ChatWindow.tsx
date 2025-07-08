"use client";
import React, {useEffect} from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import {fetchMessages, selectCurrentConversation, selectMessages} from "@/redux/conversationSlice";
import {selectUser} from "@/redux/userSlice";
import {MessageType, UserDataType} from "@/utils/types";
import {AppDispatch} from "@/redux/store";

function ChatWindow() {
    const darkMode = useSelector(selectDarkMode);
    const messages: MessageType[] = useSelector(selectMessages);
    const user: UserDataType | null = useSelector(selectUser);
    const currentConversation = useSelector(selectCurrentConversation);
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        if (messages.length !== 0 || !currentConversation?.id) return;
        dispatch(fetchMessages(currentConversation.id))
    }, [currentConversation?.id, dispatch, messages.length]);
    return (
        <div
            className={`flex flex-col h-full w-full ${darkMode ? "bg-gradient-to-br from-slate-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-blue-50"}`}>
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-6 bg-cover bg-center"
                 style={{backgroundImage: darkMode ? "url('/path-to-dark-whatsapp-bg.png')" : "url('/path-to-light-whatsapp-bg.png')"}}>
                <div className="space-y-4">
                    {
                        messages.map((message) => {
                            return <ChatMessage key={message.created_at} text={message.content}
                                                time={message.created_at}
                                                sent={message.sender_id === user?.id}/>
                        })
                    }
                </div>
            </div>
            <ChatInput/>
        </div>
    );
}

export default ChatWindow;
