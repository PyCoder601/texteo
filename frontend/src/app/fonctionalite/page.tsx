"use client";
import React from "react";
import {motion} from "framer-motion";
import Header from "@/ui/Header";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import Footer from "@/ui/Footer";

const features = [
    {
        title: "Authentification sécurisée",
        description: "Connexion et inscription avec JWT (access & refresh token) pour une session sécurisée.",
        icon: "🔐"
    },
    {
        title: "Discussions en temps réel",
        description: "Envoyez et recevez des messages instantanément grâce aux WebSockets.",
        icon: "💬"
    },
    {
        title: "Chiffrement de bout en bout",
        description: "Vos messages sont sécurisés et lisibles uniquement par l’expéditeur et le destinataire.",
        icon: "🔒"
    },
    {
        title: "Statut en ligne",
        description: "Voyez si un utilisateur est connecté en temps réel, géré par Redis.",
        icon: "🟢"
    },
    {
        title: "Dernière activité",
        description: "Consultez la dernière fois qu’un utilisateur a été actif, même après redémarrage du serveur.",
        icon: "⏱️"
    },
    {
        title: "Notifications de nouveaux messages",
        description: "Recevez des notifications en direct dès qu’un nouveau message est envoyé dans une conversation.",
        icon: "🔔"
    },
    {
        title: "Système de lecture",
        description: "Suivez quels messages ont été lus grâce au champ is_read mis à jour dynamiquement.",
        icon: "✅"
    },
    {
        title: "Gestion des contacts",
        description: "Ajoutez, modifiez ou supprimez des contacts pour démarrer de nouvelles conversations.",
        icon: "📇"
    },
    {
        title: "Profil utilisateur",
        description: "Personnalisez votre profil avec un nom, une bio, un avatar et plus encore.",
        icon: "👤"
    },
    {
        title: "Historique de conversations",
        description: "Chargez les 30 derniers messages de chaque discussion pour garder le contexte.",
        icon: "📜"
    },
    {
        title: "Suppression de discussion",
        description: "Supprimez des conversations que vous ne souhaitez plus garder.",
        icon: "🗑️"
    },
    {
        title: "UI réactive et moderne",
        description: "Interface construite avec React + TypeScript pour une expérience fluide.",
        icon: "⚡"
    }
];


export default function Fonctionnalite() {
    const darkMode: boolean = useSelector(selectDarkMode)
    return (
        <main
            className={`flex flex-col min-h-screen ${darkMode ? 'bg-gradient-to-br ' +
                'from-[#111b21] to-[#202c33] text-white' : 'bg-gray-100 text-gray-800'} 
                transition-colors duration-300`}>
            <Header/>
            <section className="px-8 py-20 max-w-7xl mx-auto">
                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-12"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    Fonctionnalités
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {features.map(({title, description, icon}, index) => (
                        <motion.div
                            key={title}
                            className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-[#202c33]' : 'bg-white'}`}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: index * 0.1}}
                        >
                            <div className="text-5xl mb-4">{icon}</div>
                            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer darkMode={darkMode}/>
        </main>
    );
}