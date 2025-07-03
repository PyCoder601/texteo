import Img from 'next/image'
import {selectDarkMode, toggleDarkMode} from "@/redux/uiSlice";
import {Moon, Sun, MessageSquare, MessageSquareDiff} from "lucide-react";
import {motion} from "framer-motion";
import React from "react";
import {AppDispatch} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "@/redux/userSlice";
import {UserDataType} from "@/utils/types";

export default function Sidebar({setPageToRender}: { setPageToRender: (page: string) => void }) {
    const user: UserDataType | null = useSelector(selectUser)
    const dispatch: AppDispatch = useDispatch();
    const darkMode: boolean = useSelector(selectDarkMode);
    return (
        <div className="w-16 h-screen flex flex-col justify-between py-4">
            <div className="flex flex-col items-center space-y-4">
                <div className={"cursor-pointer"}>
                    <Img
                        src={user?.avatar_url || "/avatar.jpg"}
                        alt="avatar"
                        width={30}
                        height={32}
                        objectFit="cover"
                        className="rounded-full border-4 border-gray-500  transition-opacity"
                        onClick={() => setPageToRender("profileCard")}
                    />
                </div>
                <MessageSquareDiff size={32} className={"text-gray-500 hover:text-gray-800 cursor-pointer"}
                                   onClick={() => setPageToRender("addContact")}/>

                <MessageSquare size={32} className="text-gray-500 hover:text-gray-800 cursor-pointer"
                               onClick={() => setPageToRender("conversationList")}/>
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
