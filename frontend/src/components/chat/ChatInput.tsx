"use client";
import React, {useEffect, useRef} from "react";
import {Send} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import {ACCESS_TOKEN} from "@/utils/constant";
import {AppDispatch} from "@/redux/store";
import {addMessage, selectCurrentConversation} from "@/redux/conversationSlice";

function ChatInput() {
    const darkMode = useSelector(selectDarkMode);
    const token = sessionStorage.getItem(ACCESS_TOKEN)
    const socketRef = useRef<WebSocket | null>(null);
    const currentConversation = useSelector(selectCurrentConversation)
    const dispatch: AppDispatch = useDispatch();
    const [newMessage, setNewMessage] = React.useState<string>("");
    useEffect(() => {
        if (!token) return;
        if (!currentConversation?.id) return;

        const ws = new WebSocket(`ws://localhost:8002/api/chat/${currentConversation?.id}?token=${token}`, "chat");
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            dispatch(addMessage(data));
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };


        return () => {
            ws.close();
        };
    }, [currentConversation?.id, dispatch, token]);

    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && newMessage.trim()) {
            socketRef.current.send(JSON.stringify({content: newMessage}));
            setNewMessage("");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div
            className={`flex items-center p-3 ${darkMode ? "bg-slate-800/50 border-t border-slate-700" : "bg-gray-100/80 border-t border-gray-200"} backdrop-blur-sm`}>
            <input
                type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full p-2 rounded-lg ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
            />
            <button
                className="ml-3 p-2 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Send size={20} onClick={sendMessage}/>
            </button>
        </div>
    );
}

export default ChatInput;
