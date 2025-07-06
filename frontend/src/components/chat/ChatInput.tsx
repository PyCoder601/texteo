"use client";
import React from "react";
import {Send} from "lucide-react";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";

function ChatInput() {
    const darkMode = useSelector(selectDarkMode);

    return (
        <div
            className={`flex items-center p-3 ${darkMode ? "bg-slate-800/50 border-t border-slate-700" : "bg-gray-100/80 border-t border-gray-200"} backdrop-blur-sm`}>
            <input
                type="text"
                placeholder="Type a message"
                className={`w-full p-2 rounded-lg ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
            />
            <button
                className="ml-3 p-2 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Send size={20}/>
            </button>
        </div>
    );
}

export default ChatInput;
