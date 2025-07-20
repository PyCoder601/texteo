"use client";
import React, { RefObject } from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    selectDarkMode,
    selectShowOptions,
    selectShowReactions, setToShowOptions, setToShowReactions,
} from "@/redux/uiSlice";
import Image from 'next/image';
import {Smile, MessageCircleMore, Trash2} from "lucide-react";
import {AppDispatch} from "@/redux/store";
import {selectCurrFriend} from "@/redux/userSlice";

interface ChatMessageProps {
    text: string;
    time: string;
    sent: boolean;
    type: "text" | "photo" | "deleted";
    id: number;
    reactionProp: string | null;
    socketRef: RefObject<WebSocket | null>;
}

const reactions: string[] = ["🤝", "😂", "❤️", "😱", "😮", "😡", "🤬", "🤯", "😳"];

function ChatMessage({text, time, sent, type, id, reactionProp, socketRef}: ChatMessageProps) {
    const darkMode: boolean = useSelector(selectDarkMode);
    const [reaction, setReaction] = React.useState<string | null>(reactionProp);
    const toShowReactions: number | null = useSelector(selectShowReactions)
    const toShowOptions: number | null = useSelector(selectShowOptions)
    const dispatch: AppDispatch = useDispatch();

    const friend = useSelector(selectCurrFriend)

    const messageClass = sent
        ? `self-end ${darkMode ? "bg-gradient-to-br from-teal-800 to-green-800" : "bg-gradient-to-br from-green-100 to-teal-100"} shadow-md`
        : `self-start ${darkMode ? "bg-slate-700" : "bg-white"} shadow-md`;

    const handleSetReaction = (selectedReaction: string) => {
        setReaction(selectedReaction);
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                reaction: selectedReaction,
                message_id: id,
                receiver_id: friend?.id,
                type: "reaction",
            }));

            dispatch(setToShowReactions(null))
            dispatch(setToShowOptions(null))
        }
    };

    const handleDeleteMessage = async () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                message_id: id,
                type: "supprimer_message",
            }));
        }
    }

        return (
            <div className={`flex group ${sent ? "justify-end" : "justify-start"} relative`}
                 onClick={(e) => {
                     if (e.target === e.currentTarget) {
                         dispatch(setToShowReactions(null))
                         dispatch(setToShowOptions(null))
                     }
                 }}
            >

                {type === "deleted" ? (
                        <div className={`rounded-lg py-2 px-3 max-w-md relative ${messageClass}`}>
                            <p className="text-sm italic ">Ce message a été supprimé</p>
                        </div>) :
                    <div className={`rounded-lg py-2 px-3 max-w-md relative ${messageClass}`}>
                        {type === "photo" ? (
                            <Image src={text} alt="photo" width={300} height={300} className="rounded-lg"/>
                        ) : (
                            <p className="text-sm">{text}</p>
                        )}
                        <span
                            className={`text-xs ${darkMode ? "text-gray-400/80" : "text-gray-500/80"} float-right ml-2 mt-1`}>{time}</span>
                        <button onClick={() =>
                            toShowOptions !== null ? dispatch(setToShowOptions(null)) : dispatch(setToShowOptions(id))
                        }
                                className={`absolute ${sent ? "-left-8" : "-right-8"} top-1/2 -translate-y-1/2
                         opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}>
                            <MessageCircleMore size={20} className="text-gray-500"/>
                        </button>
                        {reactionProp && (
                            <div
                                onClick={() =>
                                    toShowReactions !== null ? dispatch(setToShowReactions(null)) : dispatch(setToShowReactions(id))
                                }
                                className="absolute -bottom-3 -right-2 bg-gray-100 dark:bg-slate-600 cursor-pointer rounded-full p-1 shadow-md text-xs">
                                {reactionProp}
                            </div>
                        )}
                        {toShowOptions === id && (
                            <div
                                className={`absolute ${sent ? "right-full mr-7" : "left-full ml-7"} bottom-1/5 mt-8 w-40 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10`}>
                                <ul>
                                    <li onClick={() => {
                                        dispatch(setToShowReactions(id));
                                        dispatch(setToShowOptions(null))
                                    }}
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center">
                                        <Smile size={18} className="mr-2"/> Réagir
                                    </li>
                                    <li onClick={() => {
                                        const isSur = confirm("Ce message sera supprimer pour tout le monde")
                                        if (isSur) {
                                            handleDeleteMessage().catch(() => alert("Impossible de supprimer le message"))
                                            dispatch(setToShowReactions(null))
                                            dispatch(setToShowOptions(null))
                                        }
                                    }}
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-red-500">
                                        <Trash2 size={18} className="mr-2"/> Supprimer
                                    </li>
                                </ul>
                            </div>
                        )}

                        {toShowReactions === id && (
                            <div
                                className={`absolute z-10 ${sent ? "right-0" : "left-0"} bottom-[-15px] flex space-x-2 bg-white dark:bg-slate-700 p-2 rounded-full shadow-lg`}>
                                {reactions.map((r) => (
                                    <button key={r} onClick={() => handleSetReaction(r)}
                                            className="text-xl hover:scale-125 transition-transform">
                                        {r}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>}
            </div>
        );
    }

export default ChatMessage;
