"use client"
import React from "react";
import ConversationList from "@/components/conversation/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode, selectShowContactInfo, setNotification} from "@/redux/uiSlice";
import Sidebar from "@/components/SideBar";
import ProfileCard from "@/components/ProfieCard";
import AddContact from "@/components/conversation/AddContact";
import {
    addMessage,
    setMessage,
    fetchConversations,
    selectCurrentConversation, deleteConversation,
} from "@/redux/conversationSlice";
import {ACCESS_TOKEN} from "@/utils/constant";
import {AppDispatch} from "@/redux/store";
import ContactInfo from "@/components/chat/ContactInfo";
import {setCurrFriendStatus} from "@/redux/userSlice";
import {useRouter} from "next/navigation";

const websocketUrl: string = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";

function Page() {
    const darkMode = useSelector(selectDarkMode);
    const showContactInfo = useSelector(selectShowContactInfo)
    const [pageToRender, setPageToRender] = React.useState<string>('conversationList');
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    const socketRef = React.useRef<WebSocket | null>(null);
    const dispatch: AppDispatch = useDispatch();
    const currentConversation = useSelector(selectCurrentConversation) || {id: 9999}
    const router = useRouter();
    const [isAuth, setIsAuth] = React.useState(false);


    React.useEffect(() => {
        if (!token) {
            router.push("/login");
        } else {
            setIsAuth(true);
        }
    }, [token, router]);

    React.useEffect(() => {
        if (!isAuth) {
            return;
        }

        const ws = new WebSocket(`${websocketUrl}chat/${currentConversation.id}?token=${token}`, "chat");
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "new_message") {
                dispatch(addMessage(data.new_message_data));
                dispatch(fetchConversations());
            }

            if (data.type === "new_conversation") {
                dispatch(fetchConversations());
                dispatch(setNotification({
                    type_event: "success",
                    titre: "Nouveau message",
                    message: `Vous avez un message venant de ${data.friend_name}`
                }))
            }

            if (data.type === "supprimer_message") {
                dispatch(setMessage(data.message_data))
            }

            if (data.type === "reaction") {
                dispatch(setMessage(data.message_data))
            }

            if (data.type === "new_reaction") {
                dispatch(setNotification({
                    titre: "reaction",
                    type_event: "success",
                    message: `${data.friend_name} a réagi à un message`
                }))
            }

            if (data.type === "supprimer_conversation") {
                dispatch(deleteConversation(data.conversation_id))
            }

            if (data.type === "friend_connected") {
                dispatch(setCurrFriendStatus({
                    status: true
                }))
            }

            if (data.type === "friend_disconnected") {
                dispatch(setCurrFriendStatus({
                    last_seen: data.last_seen,
                    status: false,
                }))
            }
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        ws.onerror = (error) => {
            console.log("WebSocket error:", error);
        };

        return () => {
            ws.close();
        };
    }, [currentConversation?.id, token, dispatch, isAuth]);

    if (!isAuth) {
        return null;
    }

    return (
        <main
            className={`flex h-screen ${darkMode ? "bg-gradient-to-br from-slate-900 to-gray-800 text-white" : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800"}`}>
            <Sidebar setPageToRender={setPageToRender}/>
            <div className={`w-full md:w-1/3 lg:w-1/4 border-r ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
                {pageToRender === 'conversationList' && <ConversationList/>}
                {pageToRender === 'profileCard' && <ProfileCard/>}
                {pageToRender === 'addContact' && <AddContact setPageToRender={setPageToRender}/>}
            </div>
            <div className={`hidden md:flex flex-col w-2/3 lg:w-3/4`}>
                {showContactInfo ? <ContactInfo/> : <ChatWindow ws={socketRef}/>}
            </div>
        </main>
    );
}

export default Page;