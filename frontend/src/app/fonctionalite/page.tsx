"use client";
import React from "react";
import {motion} from "framer-motion";
import Header from "@/ui/Header";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import Footer from "@/ui/Footer";
import {
    ShieldCheck,
    MessageSquare,
    Lock,
    Signal,
    Clock,
    Bell,
    CheckCircle,
    Users,
    User,
    History,
    Trash2,
    Zap
} from "lucide-react";

const features = [
    {
        title: "Authentification robuste et sécurisée",
        description: "Profitez d'une connexion sécurisée avec JWT, incluant access et refresh tokens pour une session sans faille.",
        icon: <ShieldCheck size={48} className="text-teal-400"/>
    },
    {
        title: "Discussions en temps réel",
        description: "Échangez des messages instantanément grâce à notre intégration WebSocket pour une communication fluide.",
        icon: <MessageSquare size={48} className="text-green-400"/>
    },
    {
        title: "Confidentialité renforcée",
        description: "Vos conversations sont protégées par un chiffrement de bout en bout, garantissant que seuls vous et votre destinataire puissiez les lire.",
        icon: <Lock size={48} className="text-teal-400"/>
    },
    {
        title: "Statut de présence en direct",
        description: "Visualisez en temps réel qui est en ligne, une fonctionnalité propulsée par Redis pour une réactivité maximale.",
        icon: <Signal size={48} className="text-green-400"/>
    },
    {
        title: "Indicateur de dernière activité",
        description: "Sachez quand un utilisateur a été actif pour la dernière fois, une information persistante même après un redémarrage du serveur.",
        icon: <Clock size={48} className="text-teal-400"/>
    },
    {
        title: "Notifications instantanées",
        description: "Soyez alerté en temps réel des nouveaux messages, pour ne jamais manquer une information importante.",
        icon: <Bell size={48} className="text-green-400"/>
    },
    {
        title: "Confirmation de lecture",
        description: "Suivez facilement les messages lus et non lus grâce à un système de mise à jour dynamique.",
        icon: <CheckCircle size={48} className="text-teal-400"/>
    },
    {
        title: "Gestion de contacts simplifiée",
        description: "Ajoutez, modifiez ou supprimez des contacts pour organiser vos conversations en toute simplicité.",
        icon: <Users size={48} className="text-green-400"/>
    },
    {
        title: "Profil utilisateur personnalisable",
        description: "Créez un profil à votre image en ajoutant un nom, une biographie et un avatar personnalisé.",
        icon: <User size={48} className="text-teal-400"/>
    },
    {
        title: "Historique complet des conversations",
        description: "Accédez aux 30 derniers messages de chaque discussion pour retrouver facilement le fil de la conversation.",
        icon: <History size={48} className="text-green-400"/>
    },
    {
        title: "Suppression facile des discussions",
        description: "Gardez votre espace de discussion organisé en supprimant les conversations que vous ne souhaitez plus conserver.",
        icon: <Trash2 size={48} className="text-teal-400"/>
    },
    {
        title: "Interface utilisateur moderne et réactive",
        description: "Profitez d'une expérience utilisateur fluide et agréable, conçue avec React et TypeScript pour des performances optimales.",
        icon: <Zap size={48} className="text-green-400"/>
    }
];


export default function Fonctionnalite() {
    const darkMode: boolean = useSelector(selectDarkMode);

    return (
        <main
            className={`flex flex-col min-h-screen ${darkMode ? "bg-gradient-to-br from-[#111b21] " +
                "to-[#202c33] text-white" : "bg-gradient-to-br from-gray-100 to-gray-200 " +
                "text-gray-800"} transition-colors duration-300`}
        >
            <Header/>
            <section className="px-4 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-12 max-w-7xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, ease: "easeOut"}}
                    className="text-center mb-10 sm:mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                        Découvrez nos <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">fonctionnalités</span>
                    </h1>
                    <p className={`mt-4 text-lg sm:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Une suite complète d&#39;outils pour une communication sécurisée, rapide et intuitive.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map(({title, description, icon}, index) => (
                        <motion.div
                            key={title}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            className={`p-6 rounded-xl shadow-lg flex flex-col items-start h-full ${darkMode ? 'bg-[#202c33] ' +
                                'hover:bg-[#2a3a4d]' : 'bg-white/70 hover:bg-white'} transition-all
                                 duration-300 transform hover:-translate-y-1 backdrop-blur-sm`}
                        >
                            <div className="mb-4">{icon}</div>
                            <h2 className="text-xl font-bold mb-2">{title}</h2>
                            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer darkMode={darkMode}/>
        </main>
    );
}
