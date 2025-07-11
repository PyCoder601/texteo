"use client";
import React from "react";
import {Paperclip, Send} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import {ACCESS_TOKEN} from "@/utils/constant";
import {AppDispatch} from "@/redux/store";
import {addMessage, fetchConversations, selectCurrentConversation} from "@/redux/conversationSlice";

const websocketUrl: string | undefined = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

function ChatInput() {
    const darkMode = useSelector(selectDarkMode);
    const token = sessionStorage.getItem(ACCESS_TOKEN)
    const socketRef = React.useRef<WebSocket | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const currentConversation = useSelector(selectCurrentConversation)
    const dispatch: AppDispatch = useDispatch();
    const [newMessage, setNewMessage] = React.useState<string>("");

    React.useEffect(() => {
        if (!token || !currentConversation?.id) {
            return;
        }

        const ws = new WebSocket(`${websocketUrl}/${currentConversation.id}?token=${token}`, "chat");
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            dispatch(addMessage(data));
            dispatch(fetchConversations());
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        ws.onerror = (error) => {
            console.log("WebSocket error:", error);
        };

        return () => {
            ws.close();
        };
    }, [currentConversation?.id, token, dispatch]);

    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && newMessage.trim()) {
            socketRef.current.send(JSON.stringify({content: newMessage, type: "text"}));
            setNewMessage("");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(arrayBuffer);
                }
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className={`flex items-center p-3 ${darkMode ? "bg-slate-800/50 border-t border-slate-700" : "bg-gray-100/80 border-t border-gray-200"} backdrop-blur-sm`}>
            <input
                type="file"
                ref={fileInputRef}
                style={{display: 'none'}}
                accept="image/*"
                onChange={handleFileChange}
            />
            <button
                onClick={handlePaperclipClick}
                className={`mx-2 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
                <Paperclip/></button>
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
