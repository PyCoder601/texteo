"use client";
import React, {useEffect} from "react";
import {AppDispatch} from "@/redux/store";
import {useDispatch} from "react-redux";
import {setNotification} from "@/redux/uiSlice";

interface NotificationProps {
    type_event: "success" | "error" | "info";
    titre: string;
    message: string;
}

const Notification: React.FC<NotificationProps> = ({type_event, message, titre}) => {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                dispatch(setNotification(null));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, message]);

    if (!message) {
        return null;
    }

    const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-all duration-500 transform";
    const typeStyles = {
        success: "bg-green-900",
        error: "bg-red-800",
        info: "bg-blue-900",
    };

    return (
        <div className={`${baseStyle} ${typeStyles[type_event]} translate-x-0 opacity-100 z-50`}>
            <p className="font-bold capitalize">{titre}</p>
            <p>{message}</p>
        </div>
    );
};

export default Notification;