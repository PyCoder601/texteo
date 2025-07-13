"use client";
import React, {RefObject} from "react";
import {Paperclip, Send} from "lucide-react";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import { selectCurrentConversation } from "@/redux/conversationSlice";


type ChatWindowProps = {
  socketRef: RefObject<WebSocket | null>;
};

function ChatInput({socketRef}: ChatWindowProps) {
    const darkMode = useSelector(selectDarkMode);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [newMessage, setNewMessage] = React.useState<string>("");
    const currentConversation = useSelector(selectCurrentConversation);
    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && newMessage.trim()) {
            socketRef.current.send(JSON.stringify({message_text: newMessage, type: "message", receiver_id: currentConversation?.friend.id}));
            setNewMessage("");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(
                        JSON.stringify({
                            photo: base64,
                            type: "message",
                            receiver_id: currentConversation?.friend.id,
                        })
                    );
                }
            };

            reader.readAsDataURL(file);
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
