"use client";
import React from "react";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";

interface ChatMessageProps {
    text: string;
    time: string;
    sent: boolean;
}

function ChatMessage({ text, time, sent }: ChatMessageProps) {
    const darkMode = useSelector(selectDarkMode);
    const messageClass = sent
        ? `self-end ${darkMode ? "bg-gradient-to-br from-teal-800 to-green-800" : "bg-gradient-to-br from-green-100 to-teal-100"} shadow-md`
        : `self-start ${darkMode ? "bg-slate-700" : "bg-white"} shadow-md`;

    return (
        <div className={`flex ${sent ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg py-2 px-3 max-w-md relative ${messageClass}`}>
                <p className="text-sm">{text}</p>
                <span className={`text-xs ${darkMode ? "text-gray-400/80" : "text-gray-500/80"} float-right ml-2 mt-1`}>{time}</span>
            </div>
        </div>
    );
}

export default ChatMessage;
