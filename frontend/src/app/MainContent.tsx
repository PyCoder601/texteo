"use client";
import React from "react";
import {useSelector} from "react-redux";
import {selectNotification} from "@/redux/uiSlice";
import Notification from "@/components/notification/Notification";

export default function MainContent({children}: { children: React.ReactNode }) {
    const notification = useSelector(selectNotification);

    return (
        <>
            {notification && (
                <Notification
                    type_event={notification.type_event}
                    titre={notification.titre}
                    message={notification.message}
                />
            )}
            {children}
        </>
    );
}
