"use client";
import React, {useState} from "react";
import ConversationListItem from "@/components/conversation/ConversationListItem";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import {Search} from "lucide-react";
import {selectConversations} from "@/redux/conversationSlice";

function ConversationList() {
    const darkMode = useSelector(selectDarkMode);
    const conversations = useSelector(selectConversations);
    const [searchQuery, setSearchQuery] = useState("");

    console.log(conversations)

    const filteredConversations = conversations
        .filter((conversation) =>
            conversation.friend.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
            const dateB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
            return dateB - dateA;
        });

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                    <ConversationListItem key={conversation.id} conversation={conversation}/>
                ))}
            </div>
        </div>
    );
}

export default ConversationList;