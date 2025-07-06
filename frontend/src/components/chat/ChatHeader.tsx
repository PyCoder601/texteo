"use client";
import React from "react";
import {MoreVertical} from "lucide-react";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import {selectCurrentConversation} from "@/redux/conversationSlice";
import Image from "next/image";


function ChatHeader() {
    const darkMode: boolean = useSelector(selectDarkMode);
    const currentConversation = useSelector(selectCurrentConversation);
    const {friend} = currentConversation || {};
    return (
        <header className={`flex items-center justify-between p-3 border-b ${darkMode ?
            "bg-slate-800/50 border-slate-700" : "bg-white/80 border-gray-200"} 
            backdrop-blur-sm shadow-sm`}>
            <div className="flex items-center">
                {friend?.avatar_url && !friend.avatar_url.includes("None") ?
                    <Image
                        src={friend.avatar_url}
                        alt="Profile picture"
                        width={50}
                        height={40}
                        objectFit="cover"
                        className="rounded-full border-1 border-gray-500 group-hover:opacity-75 transition-opacity mr-3.5"
                    /> :
                    <div
                        className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-green-600 rounded-full mr-4 shadow-md"></div>
                }
                <div>
                    <h2 className="font-semibold">{friend?.username}</h2>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Online</p>
                </div>
            </div>
            <div>
                <button
                    className={`${darkMode ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
                    <MoreVertical size={20}/></button>
            </div>
        </header>
    );
}

export default ChatHeader;
