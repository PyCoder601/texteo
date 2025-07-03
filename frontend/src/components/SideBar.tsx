import Img from 'next/image'
import {selectDarkMode, toggleDarkMode} from "@/redux/uiSlice";
import {Moon, Sun, MessageSquare, Users} from "lucide-react";
import {motion} from "framer-motion";
import React from "react";
import {AppDispatch} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";

export default function Sidebar({setPageToRender}: { setPageToRender: (page: string) => void }) {
    const dispatch: AppDispatch = useDispatch();
    const darkMode: boolean = useSelector(selectDarkMode);
    return (
        <div className="w-16 h-screen flex flex-col justify-between py-4">
            <div className="flex flex-col items-center space-y-4">
                <Img
                    width={32}
                    height={32}
                    src="/avatar.jpg"
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                    onClick={() => setPageToRender("profileCard")}
                />
                <MessageSquare size={32} className="text-gray-500 hover:text-gray-800 cursor-pointer"
                               onClick={() => setPageToRender("conversationList")}/>
                <Users size={32} className="text-gray-500 hover:text-gray-800 cursor-pointer"
                       onClick={() => setPageToRender("contacts")}/>
                <motion.button
                    onClick={() => dispatch(toggleDarkMode())}
                    className={`p-2 rounded-full ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                >
                    {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
                </motion.button>
            </div>
        </div>
    );
}
