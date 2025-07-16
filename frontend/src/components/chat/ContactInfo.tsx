"use client";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode, setShowContactInfo} from "@/redux/uiSlice";
import Image from "next/image";
import {X} from "lucide-react";
import {AppDispatch} from "@/redux/store";
import {selectCurrFriend} from "@/redux/userSlice";

function ContactInfo() {
    const darkMode: boolean = useSelector(selectDarkMode);
    const dispatch: AppDispatch = useDispatch();
    const friend = useSelector(selectCurrFriend)


    if (!friend) {
        return (
            <div
                className={`flex flex-col h-full w-full items-center justify-center text-center p-8 ${darkMode ? "bg-gradient-to-br from-slate-900 to-gray-800 text-gray-300" : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-600"}`}>
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Contact Details
                </h1>
                <p className="text-lg">Selectionner une discussion pour avoir le detail</p>
            </div>
        );
    }

    return (
        <div className={` relative flex flex-col h-full w-full p-6 ${darkMode ? "bg-gradient-to-br " +
            "from-slate-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-blue-50"}`}>
            <X size={40} className={"absolute top-2 left-2"} onClick={() => dispatch(setShowContactInfo(false))}/>
            <div className="flex flex-col items-center">
                {friend.avatar_url && !friend.avatar_url.includes("None") ? (
                    <Image
                        src={friend.avatar_url}
                        alt="Profile picture"
                        width={128}
                        height={128}
                        objectFit="cover"
                        className="rounded-full border-4 border-gray-500"
                    />
                ) : (
                    <div
                        className="w-32 h-32 bg-gradient-to-tr from-teal-400 to-green-600 rounded-full shadow-md"></div>
                )}
                <h2 className={`text-2xl font-bold mt-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{friend.username}</h2>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{friend.email}</p>
                <div className={`mt-6 w-full border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>
                <div className="mt-6 w-full text-center">
                    <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Bio</h3>
                    <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{friend.bio || "No bio available."}</p>
                </div>
            </div>
        </div>
    );
}

export default ContactInfo;