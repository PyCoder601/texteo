"use client";
import React from "react";
import ConversationListItem from "@/components/ConversationListItem";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import {Search} from "lucide-react";

function ConversationList() {
    const darkMode = useSelector(selectDarkMode);

    return (
        <div className={`flex flex-col h-full ${darkMode ? "bg-slate-800/50" : "bg-white/80"} backdrop-blur-sm`}>
            <div className="p-3">
                <div className={`relative`}>
                    <Search
                        className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        size={20}/>
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        className={`w-full pl-10 p-2 rounded-lg ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-gray-100 border-gray-300"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <ConversationListItem name="Alice" lastMessage="See you tomorrow!" time="10:42 AM" unread={2}/>
                <ConversationListItem name="Bob" lastMessage="Okay, sounds good." time="10:30 AM"/>
                <ConversationListItem name="Charlie" lastMessage="Photo" time="Yesterday"/>
                <ConversationListItem name="David" lastMessage="Thanks!" time="Yesterday"/>
            </div>
        </div>
    );
}

export default ConversationList;
