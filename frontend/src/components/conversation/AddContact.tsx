"use client";
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectDarkMode} from '@/redux/uiSlice';
import {UserPlus, ArrowLeft} from 'lucide-react';
import api from "@/service/api";
import axios from "axios";
import {AppDispatch} from "@/redux/store";
import {fetchConversations, setCurrentConversation} from "@/redux/conversationSlice";


function AddContact({setPageToRender}: { setPageToRender: (page: string) => void }) {
    const darkMode: boolean = useSelector(selectDarkMode);
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string>('');
    const dispatch: AppDispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!username) return;
        setLoading(true);
        try {
            const response = await api.post('/conversation', {
                username
            })
            dispatch(setCurrentConversation(response.data))
            dispatch(fetchConversations())
            setPageToRender('conversationList')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.detail || "Erreur inconnue")
            } else {
                setError("Erreur réseau ou serveur")
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className={`flex flex-col h-full ${darkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm p-4`}>
            <div className="flex items-center mb-4">
                <button
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}>
                    <ArrowLeft size={20} onClick={() => setPageToRender('conversationList')}/>
                </button>
                <h2 className={`text-2xl font-bold ml-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Nouvelle
                    conversation</h2>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="contact-id"
                           className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Son Nom d&#39;utilisateur
                    </label>
                    <input
                        id="contact-id"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Entre son Nom d'utilisateur"
                        className={`w-full mt-1 p-2 rounded-lg ${darkMode ? 'bg-slate-700/50 ' +
                            'border-slate-600' : 'bg-gray-100 border-gray-300'} focus:outline-none
                             focus:ring-2 focus:ring-teal-500 transition-all`}
                    />
                </div>
                <button
                    className={`w-full flex items-center justify-center p-2 rounded-lg ${darkMode ? 'bg-teal-600 ' +
                        'hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white`}
                    onClick={handleSubmit}
                >
                    <UserPlus size={20} className="mr-2"/>
                    {loading ? "Chargement..." : "Commencer"}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </div>
    );
}

export default AddContact;
