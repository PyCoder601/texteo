"use client";
import React from "react";
import { MoreVertical, Search } from "lucide-react";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";

interface ChatHeaderProps {
    name: string;
    status: string;
}

function ChatHeader({ name, status }: ChatHeaderProps) {
    const darkMode = useSelector(selectDarkMode);

    return (
        <header className={`flex items-center justify-between p-3 border-b ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm shadow-sm`}>
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-tr from-teal-400 to-green-600 rounded-full mr-4 shadow-md"></div>
                <div>
                    <h2 className="font-semibold">{name}</h2>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{status}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button className={`${darkMode ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}><Search size={20}/></button>
                <button className={`${darkMode ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}><MoreVertical size={20}/></button>
            </div>
        </header>
    );
}

export default ChatHeader;
