"use client";
import React, {useState, useRef, useEffect, RefObject} from "react";
import {MoreVertical} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode, setShowContactInfo} from "@/redux/uiSlice";
import {selectCurrentConversation} from "@/redux/conversationSlice";
import Image from "next/image";
import {AppDispatch} from "@/redux/store";
import api from "@/service/api";
import {selectCurrFriend, setCurrFriend} from "@/redux/userSlice";
import {formatDate} from "@/utils/helpers";

type ChatHeaderProps = {
    socketRef: RefObject<WebSocket | null>;
};

function ChatHeader({socketRef}: ChatHeaderProps) {
    const darkMode: boolean = useSelector(selectDarkMode);
    const currentConversation = useSelector(selectCurrentConversation);
    const friend = useSelector(selectCurrFriend)
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

    const handleDeleteConversation = async () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                conversation_id: currentConversation?.id,
                type: "supprimer_conversation",
                receiver_id: friend?.id,
            }));
        }
    }

    useEffect(() => {
        if (!currentConversation) return;

        async function fetchFriend() {
            const response = await api.get(`/user/${currentConversation?.friend.id}`);
            dispatch(setCurrFriend(response.data));
        }

        fetchFriend().catch(() => console.log("error"));
    }, [currentConversation, dispatch])

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
            {friend &&
                <>
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
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{friend?.is_online ? "en ligne"
                        : `last seen: ${formatDate(friend?.last_seen as string)}`}</p>
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
                                className={`absolute right-2 w-48 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} 
                        border rounded-md shadow-lg z-10`}>
                                <ul className={`py-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                                    <li>
                                        <button
                                            onClick={() => dispatch(setShowContactInfo(true))}
                                            className={`block px-4 py-2 w-full text-sm ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}>
                                            Info du contact
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                const isSur = confirm("Supprimer la discussion")
                                                if (isSur) {
                                                    handleDeleteConversation()
                                                }
                                            }}
                                            className={`block px-4 py-2 w-full text-sm ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"} text-red-500`}>
                                            Supprimer la discussion
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </>
            }
        </header>
    );
}

export default ChatHeader;
