"use client";
import React from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";

function ChatWindow() {
    const darkMode = useSelector(selectDarkMode);

    return (
        <div
            className={`flex flex-col h-full w-full ${darkMode ? "bg-gradient-to-br from-slate-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-blue-50"}`}>
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-6 bg-cover bg-center"
                 style={{backgroundImage: darkMode ? "url('/path-to-dark-whatsapp-bg.png')" : "url('/path-to-light-whatsapp-bg.png')"}}>
                <div className="space-y-4">
                    <ChatMessage text="Hey, how's it going?" time="10:40 AM" sent={false}/>
                    <ChatMessage text="Pretty good! Just working on the new project. You?" time="10:41 AM" sent={true}/>
                    <ChatMessage text="Same here. It's coming along nicely." time="10:41 AM" sent={false}/>
                    <ChatMessage text="See you tomorrow!" time="10:42 AM" sent={false}/>
                </div>
            </div>
            <ChatInput/>
        </div>
    );
}

export default ChatWindow;
