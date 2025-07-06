"use client"
import React from "react";
import ConversationList from "@/components/conversation/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import Sidebar from "@/components/SideBar";
import ProfileCard from "@/components/ProfieCard";
import AddContact from "@/components/conversation/AddContact";
import {fetchConversations} from "@/redux/conversationSlice";
import {AppDispatch} from "@/redux/store";

function Page() {
    const darkMode = useSelector(selectDarkMode);
    const [pageToRender, setPageToRender] = React.useState<string>('conversationList');
    const dispatch: AppDispatch = useDispatch();
    React.useEffect(() => {
        dispatch(fetchConversations())
    }, [dispatch])

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
                <ChatWindow/>
            </div>
        </main>
    );
}

export default Page;
