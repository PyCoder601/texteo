"use client";
import React from "react";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";

interface ConversationListItemProps {
    name: string;
    lastMessage: string;
    time: string;
    unread?: number;
}

function ConversationListItem({ name, lastMessage, time, unread }: ConversationListItemProps) {
    const darkMode = useSelector(selectDarkMode);

    return (
        <div className={`flex items-center p-3 cursor-pointer ${darkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-100"} transition-colors duration-200`}>
            <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-green-600 rounded-full mr-4 shadow-md"></div>
            <div className="flex-1 border-t border-gray-200 dark:border-slate-700 py-3">
                <div className="flex justify-between">
                    <h2 className="font-semibold">{name}</h2>
                    <span className={`text-sm ${unread ? "text-teal-400" : (darkMode ? "text-gray-400" : "text-gray-500")}`}>{time}</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{lastMessage}</p>
                    {unread && (
                        <span className="bg-gradient-to-r from-teal-500 to-green-500 text-white text-xs rounded-full px-2 py-1 font-bold shadow-lg">{unread}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConversationListItem;
