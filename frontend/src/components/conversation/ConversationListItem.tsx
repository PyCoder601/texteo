"use client";
import React from "react";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import {ConversationDataType} from "@/utils/types";


function ConversationListItem({conversation}: { conversation: ConversationDataType }) {
    const darkMode: boolean = useSelector(selectDarkMode);
    const {last_message, friend} = conversation
    return (
        <div
            className={`flex items-center p-3 cursor-pointer ${darkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-100"} transition-colors duration-200`}>
            <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-green-600 rounded-full mr-4 shadow-md"></div>
            <div className="flex-1 border-t border-gray-200 dark:border-slate-700 py-3">
                <div className="flex justify-between">
                    <h2 className="font-semibold">{friend.username}</h2>
                </div>
                <div className="flex justify-between items-center">
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{last_message?.content}</p>
                </div>
            </div>
        </div>
    );
}

export default ConversationListItem;
