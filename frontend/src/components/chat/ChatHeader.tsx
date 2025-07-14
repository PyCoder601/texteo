"use client";
import React, {useState, useRef, useEffect} from "react";
import {MoreVertical} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode, setShowContactInfo} from "@/redux/uiSlice";
import {selectCurrentConversation} from "@/redux/conversationSlice";
import Image from "next/image";
import {AppDispatch} from "@/redux/store";

function ChatHeader() {
    const darkMode: boolean = useSelector(selectDarkMode);
    const currentConversation = useSelector(selectCurrentConversation);
    const {friend} = currentConversation || {};
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch: AppDispatch = useDispatch();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className={`flex items-center justify-between p-3 border-b ${darkMode ?
            "bg-slate-800/50 border-slate-700" : "bg-white/80 border-gray-200"} 
            backdrop-blur-sm shadow-sm z-20`}>
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
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className={`${darkMode ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
                    <MoreVertical size={20}/>
                </button>
                {dropdownOpen && (
                    <div
                        className={`absolute right-0 mt-2 w-48 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} 
                        border rounded-md shadow-lg z-10`}>
                        <ul className={`py-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                            <li>
                                <button
                                    onClick={() => dispatch(setShowContactInfo(true))}
                                    className={`block px-4 py-2 text-sm ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}>
                                    Info du contact
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`block px-4 py-2 text-sm ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"} text-red-500`}>
                                    Supprimer la discussion
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}

export default ChatHeader;
